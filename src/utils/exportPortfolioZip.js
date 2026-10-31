/**
 * exportPortfolioZip.js
 *
 * Generates a standalone ZIP containing a complete, self-contained portfolio website.
 * Works entirely in the browser using JSZip. No server-side calls, no API keys exposed.
 *
 * Handles:
 *  - data: URLs (base64 images from file uploads)
 *  - Remote URLs (fetched via CORS proxy if needed)
 *  - Safe HTML escaping of all customer data
 *  - Both "software-engineer" (DeveloperPro) and "creative-edge" / "modern-developer"
 *    (ModernDeveloper) template variants
 */

import JSZip from 'jszip';

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Escape text for safe insertion into HTML.
 * Prevents XSS and malformed markup.
 */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validate an external URL. Only http:// and https:// are accepted.
 * Returns the URL if valid, empty string otherwise.
 */
function safeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // invalid URL
  }
  return '';
}

/**
 * Convert a data URL to a Uint8Array binary blob.
 */
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive a file extension from a MIME type string or data-URL header.
 */
function mimeToExt(mime) {
  const m = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  };
  return m[mime] || 'jpg';
}

/**
 * Extract MIME type from a data URL header.
 */
function mimeFromDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/jpeg';
}

/**
 * Fetch a remote image and return its binary data + extension.
 * Returns null if fetch fails (network, CORS, etc.).
 */
async function fetchRemoteImage(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const ext = mimeToExt(blob.type || 'image/jpeg');
    return { data: new Uint8Array(arrayBuffer), ext };
  } catch {
    return null;
  }
}

/**
 * Process an image source string:
 *  - data URL  → extract bytes inline
 *  - http URL  → attempt fetch, fall back to external <img> src if CORS fails
 *  - empty     → null
 *
 * Returns { filename, data, ext, useFallback, fallbackSrc }
 *  - filename: relative path to store in ZIP (e.g. "assets/avatar.jpg")
 *  - data: Uint8Array | null
 *  - useFallback: whether to use an <img src="..."> pointing at the original URL
 *  - fallbackSrc: the original URL for fallback usage
 */
async function processImage(src, zipPath) {
  if (!src) return null;

  if (src.startsWith('data:')) {
    const mime = mimeFromDataUrl(src);
    const ext = mimeToExt(mime);
    const filename = `${zipPath}.${ext}`;
    return {
      filename,
      data: dataUrlToUint8Array(src),
      useFallback: false,
      fallbackSrc: null,
    };
  }

  const validUrl = safeUrl(src);
  if (validUrl) {
    const result = await fetchRemoteImage(validUrl);
    if (result) {
      const filename = `${zipPath}.${result.ext}`;
      return {
        filename,
        data: result.data,
        useFallback: false,
        fallbackSrc: null,
      };
    }
    // CORS fetch failed – embed as external link
    return {
      filename: null,
      data: null,
      useFallback: true,
      fallbackSrc: validUrl,
    };
  }

  return null;
}

// ─── Social link helpers ───────────────────────────────────────────────────────

function socialAbbrev(platform) {
  const map = {
    linkedin: 'in', github: 'gh', twitter: 'tw', youtube: 'yt',
    website: 'web', gitlab: 'gl', leetcode: 'lc', codeforces: 'cf', codechef: 'cc',
  };
  return map[platform?.toLowerCase()] || platform?.substring(0, 2) || '??';
}

function socialLabel(platform) {
  const map = {
    linkedin: 'LinkedIn', github: 'GitHub', twitter: 'Twitter', youtube: 'YouTube',
    website: 'Website', gitlab: 'GitLab', leetcode: 'LeetCode',
    codeforces: 'Codeforces', codechef: 'CodeChef',
  };
  return map[platform?.toLowerCase()] || platform || 'Link';
}

// ─── HTML generation for DeveloperPro template ────────────────────────────────

function generateDeveloperProHTML(data, images, year) {
  const name = esc(data.hero.logoText || data.hero.name || 'Developer');
  const jobTitle = esc(data.hero.title || 'Software Engineer');
  const bio = esc(data.hero.bio || '');
  const location = esc(data.contact?.location || data.hero?.location || '');
  const email = esc(data.contact?.email || '');
  const tagline = esc(data.hero.tagline || '');

  const initials = (data.hero.logoText || data.hero.name || 'JD')
    .split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Derive roles from tagline for display (static in export)
  const rolesRaw = tagline
    ? data.hero.tagline.split(/[,;|]/).map(r => r.trim()).filter(Boolean)
    : ['Developer', 'Engineer', 'Creator'];
  const firstRole = esc(rolesRaw[0] || 'Developer');

  const experienceList = (data.achievements || []).filter(a => ['job', 'internship', 'freelance'].includes(a.type));
  const achievementsList = (data.achievements || []).filter(a => a.type === 'achievement');

  const heroSkills = (data.skills && data.skills.length >= 4)
    ? data.skills.slice(0, 4).map(s => esc(s.name))
    : ['React', 'Node.js', 'TypeScript', 'SQL'];

  // Avatar HTML
  let avatarHtml = '';
  if (images.avatar) {
    const src = images.avatar.useFallback
      ? esc(images.avatar.fallbackSrc)
      : esc(images.avatar.filename);
    avatarHtml = `<img src="${src}" alt="${name}" style="width:240px;height:240px;border-radius:50px;border:3px solid rgba(45,212,191,.25);object-fit:cover;z-index:10;box-shadow:0 0 40px rgba(45,212,191,0.15);" />`;
  } else {
    avatarHtml = `<div style="width:240px;height:240px;border-radius:50px;background:rgba(45,212,191,.08);border:3px solid rgba(45,212,191,.25);display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:900;color:#2DD4BF;letter-spacing:-0.03em;z-index:10;">${initials}</div>`;
  }

  // Orbital skill pills
  const skillPills = heroSkills.map((l, i) => {
    const angles = [-60, 30, 120, 210];
    const a = angles[i] || i * 90;
    const r = 200;
    const rad = (a * Math.PI) / 180;
    const x = Math.cos(rad) * r;
    const y = Math.sin(rad) * r;
    return `<div style="position:absolute;left:calc(50% + ${x}px);top:calc(50% + ${y}px);transform:translate(-50%,-50%);padding:6px 14px;border-radius:10px;font-size:14px;font-weight:700;background:rgba(45,212,191,.08);color:#2DD4BF;border:1px solid rgba(45,212,191,.18);white-space:nowrap;z-index:20;">${l}</div>`;
  }).join('');

  // Nav links
  const navLinks = [
    ['home', 'Home'],
    ...(data.projects?.length > 0 ? [['projects', 'Projects']] : []),
    ...(experienceList.length > 0 ? [['experience', 'Experience']] : []),
    ...(achievementsList.length > 0 ? [['achievements', 'Achievements']] : []),
    ['contact', 'Contact'],
  ];
  const navHtml = navLinks.map(([id, label]) =>
    `<a href="#${id}" class="nav-link" onclick="smoothScroll(event,'${id}')">${esc(label)}</a>`
  ).join('');

  // Skills strip
  const skillsHtml = (data.skills?.length > 0)
    ? `<div style="border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);padding:18px 0;">
        <div style="max-width:1140px;margin:0 auto;padding:0 32px;display:flex;align-items:center;gap:28px;flex-wrap:wrap;">
          <span style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#71717A;white-space:nowrap;flex-shrink:0;">Stack</span>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${data.skills.map(s => `<span style="padding:4px 10px;border-radius:6px;font-size:12px;font-weight:500;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);color:#A1A1AA;white-space:nowrap;">${esc(s.name)}</span>`).join('')}
          </div>
        </div>
      </div>`
    : '';

  // Projects section
  const projectsHtml = (data.projects?.length > 0)
    ? `<section id="projects" style="padding:80px 0;border-bottom:1px solid rgba(255,255,255,.04);scroll-margin-top:100px;">
        <div style="max-width:1140px;margin:0 auto;padding:0 32px;">
          <div class="echo-heading" data-text="Projects"><h2>Projects</h2></div>
          ${data.projects.map((p, idx) => {
            const projImgInfo = images.projects?.[idx];
            let projImgHtml = '';
            if (projImgInfo) {
              const src = projImgInfo.useFallback ? esc(projImgInfo.fallbackSrc) : esc(projImgInfo.filename);
              projImgHtml = `<img src="${src}" alt="${esc(p.name)}" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;margin-bottom:16px;border:1px solid rgba(255,255,255,.06);" loading="lazy" />`;
            }
            const liveUrl = safeUrl(p.liveUrl);
            const ghUrl = safeUrl(p.githubUrl);
            const linkUrl = liveUrl || ghUrl;
            return `<div class="project-row" style="position:relative;padding:28px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:default;">
              <div style="display:grid;grid-template-columns:44px 1fr 44px;gap:32px;align-items:start;">
                <span style="font-size:44px;font-weight:900;line-height:1;letter-spacing:-0.04em;color:rgba(255,255,255,.07);padding-top:4px;">${String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-bottom:8px;">
                    <h3 style="font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;margin:0;">${esc(p.name)}</h3>
                    ${(p.techStack || []).map(t => `<span style="padding:4px 10px;border-radius:5px;font-size:12px;font-weight:500;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);color:#71717A;">${esc(t)}</span>`).join('')}
                  </div>
                  ${projImgHtml}
                  <p style="font-size:16px;line-height:1.7;color:#A1A1AA;margin-bottom:16px;">${esc(p.description)}</p>
                  ${p.highlights?.length > 0
                    ? `<ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;">
                        ${p.highlights.map(b => `<li style="display:flex;align-items:flex-start;gap:12px;font-size:16px;line-height:1.7;color:#A1A1AA;"><span style="margin-top:10px;width:5px;height:5px;border-radius:50%;background:#2DD4BF;flex-shrink:0;opacity:.7;"></span>${esc(b)}</li>`).join('')}
                      </ul>`
                    : ''}
                  <div style="display:flex;gap:12px;margin-top:16px;flex-wrap:wrap;">
                    ${liveUrl ? `<a href="${esc(liveUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;background:rgba(45,212,191,.08);color:#2DD4BF;border:1px solid rgba(45,212,191,.2);text-decoration:none;">Live Demo ↗</a>` : ''}
                    ${ghUrl ? `<a href="${esc(ghUrl)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;background:rgba(255,255,255,.04);color:#A1A1AA;border:1px solid rgba(255,255,255,.08);text-decoration:none;">GitHub ↗</a>` : ''}
                  </div>
                </div>
                ${linkUrl ? `<a href="${esc(linkUrl)}" target="_blank" rel="noopener noreferrer" style="width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.1);color:#71717A;display:flex;align-items:center;justify-content:center;text-decoration:none;flex-shrink:0;margin-top:4px;">↗</a>` : '<div style="width:40px;height:40px;"></div>'}
              </div>
            </div>`;
          }).join('')}
        </div>
      </section>`
    : '';

  // Experience section
  const experienceHtml = (experienceList.length > 0)
    ? `<div>
        <div class="echo-heading" data-text="Experience"><h2>Experience</h2></div>
        <div style="position:relative;">
          <div style="position:absolute;left:0;top:8px;bottom:24px;width:1px;background:rgba(255,255,255,.06);"></div>
          ${experienceList.map((exp, i) => `
            <div style="padding-left:32px;padding-bottom:${i < experienceList.length - 1 ? '40px' : '0'};position:relative;">
              <div style="position:absolute;left:-5px;top:8px;width:11px;height:11px;border-radius:50%;background:#09090B;border:2px solid #2DD4BF;"></div>
              <span style="display:block;font-size:13px;font-weight:600;color:#71717A;margin-bottom:6px;letter-spacing:.06em;">${esc(exp.startDate)} – ${esc(exp.endDate)}</span>
              <h3 style="font-size:20px;font-weight:700;color:#FFFFFF;margin-bottom:6px;letter-spacing:-0.01em;">${esc(exp.title)}</h3>
              <p style="font-size:16px;font-weight:600;color:#2DD4BF;margin-bottom:4px;">${esc(exp.organization || '')}</p>
              ${exp.description ? `<p style="font-size:14px;color:#71717A;margin-top:8px;">${esc(exp.description)}</p>` : ''}
            </div>`).join('')}
        </div>
      </div>`
    : '';

  // Achievements section
  const achievementsHtml = (achievementsList.length > 0)
    ? `<div id="achievements" style="scroll-margin-top:100px;">
        <div class="echo-heading" data-text="Achievements"><h2>Achievements</h2></div>
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${achievementsList.map((a, idx) => `
            <div style="display:flex;gap:20px;padding:20px;border-radius:16px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);">
              <span style="font-size:36px;font-weight:900;color:rgba(45,212,191,.18);line-height:1;letter-spacing:-0.04em;flex-shrink:0;padding-top:2px;">${String(idx + 1).padStart(2, '0')}</span>
              <div>
                <p style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#FFFFFF;margin-bottom:6px;">${esc(a.title)}</p>
                <p style="font-size:14px;color:#71717A;margin-bottom:4px;">${esc(a.organization || '')}</p>
                <p style="font-size:13px;font-weight:600;color:#2DD4BF;">${esc(a.startDate)}</p>
                ${a.description ? `<p style="font-size:13px;color:#71717A;margin-top:8px;">${esc(a.description)}</p>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`
    : '';

  // Socials
  const socialsHtml = (data.hero.socials?.length > 0)
    ? `<div style="display:flex;gap:16px;margin-bottom:48px;flex-wrap:wrap;">
        ${data.hero.socials.map(s => {
          const href = safeUrl(s.url);
          return href
            ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(socialLabel(s.platform))}" style="width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#2DD4BF;background:rgba(45,212,191,.08);border:1px solid rgba(45,212,191,.2);text-decoration:none;">${esc(socialAbbrev(s.platform))}</a>`
            : '';
        }).join('')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${name} – ${jobTitle} Portfolio" />
  <title>${name} – Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/style.css" />
  <style>
    :root { --accent: #2DD4BF; --bg: #09090B; --surface: #111113; --card: #16161A; --text: #FFFFFF; --secondary: #A1A1AA; --muted: #71717A; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased; min-height: 100vh; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #09090B; }
    ::-webkit-scrollbar-thumb { background: rgba(45,212,191,.25); border-radius: 2px; }

    /* Animations */
    @keyframes se-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .se-cur { display:inline-block;width:3px;height:.85em;background:#2DD4BF;margin-left:4px;vertical-align:middle;border-radius:1px;animation:se-blink 1s step-end infinite; }
    @keyframes se-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    .se-f1{opacity:0;animation:se-up .65s ease .1s forwards}
    .se-f2{opacity:0;animation:se-up .65s ease .25s forwards}
    .se-f3{opacity:0;animation:se-up .65s ease .4s forwards}
    .se-f4{opacity:0;animation:se-up .65s ease .55s forwards}
    .se-f5{opacity:0;animation:se-up .65s ease .7s forwards}
    @keyframes se-ring-a{from{transform:rotateX(65deg) rotateY(15deg) rotateZ(0deg)}to{transform:rotateX(65deg) rotateY(15deg) rotateZ(360deg)}}
    @keyframes se-ring-b{from{transform:rotateX(65deg) rotateY(15deg) rotateZ(0deg)}to{transform:rotateX(65deg) rotateY(15deg) rotateZ(-360deg)}}
    .r1{animation:se-ring-a 6s linear infinite}
    .r2{animation:se-ring-b 10s linear infinite}
    .r3{animation:se-ring-a 14s linear infinite}
    @keyframes se-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .se-fl{animation:se-float 4s ease-in-out infinite}
    @keyframes se-type { from { opacity:0 } to { opacity:1 } }
    .typing-cursor { display:inline-block;width:3px;height:.85em;background:#2DD4BF;margin-left:4px;vertical-align:middle;border-radius:1px;animation:se-blink 1s step-end infinite; }

    /* Hover states */
    .nav-link { font-size:14px;font-weight:500;text-decoration:none;color:#A1A1AA;transition:color .2s; }
    .nav-link:hover { color:#2DD4BF; }
    .project-row::before { content:'';position:absolute;inset:0;border-radius:16px;background:rgba(45,212,191,.03);opacity:0;transition:opacity .25s;margin:0 -20px; }
    .project-row:hover::before { opacity:1; }

    /* Echo heading */
    .echo-heading { position:relative;margin-bottom:48px;padding-top:16px;user-select:none; }
    .echo-heading::before { content:attr(data-text);position:absolute;top:-14px;left:-2px;font-size:96px;font-weight:900;line-height:1;letter-spacing:-0.04em;color:transparent;-webkit-text-stroke:1px rgba(45,212,191,0.07);pointer-events:none;white-space:nowrap; }
    .echo-heading h2 { position:relative;font-size:clamp(32px,5vw,48px);font-weight:700;line-height:1.1;letter-spacing:-0.03em;color:#2DD4BF;margin:0; }

    /* Contact form */
    .se-input { width:100%;padding:14px 18px;border-radius:12px;font-size:16px;font-family:inherit;background:#0D0D10;border:1px solid rgba(255,255,255,.08);color:#fff;outline:none;transition:border-color .2s,box-shadow .2s; }
    .se-input::placeholder { color:#3F3F46; }
    .se-input:focus { border-color:rgba(45,212,191,.4);box-shadow:0 0 0 3px rgba(45,212,191,.08); }

    /* Responsive */
    @media(max-width:768px) { .se-r{display:none!important} .se-g2{grid-template-columns:1fr!important} .se-dn{display:none!important} }
  </style>
</head>
<body>

  <!-- Announce banner for screen readers -->
  <div role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);"></div>

  <!-- NAV -->
  <header id="main-nav" style="position:fixed;top:0;left:0;right:0;z-index:100;height:72px;display:flex;align-items:center;background:transparent;border-bottom:1px solid transparent;transition:background .3s,border .3s,backdrop-filter .3s;">
    <div style="max-width:1140px;width:100%;margin:0 auto;padding:0 32px;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:34px;height:34px;border-radius:10px;background:#2DD4BF;color:#09090B;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;letter-spacing:-0.02em;">${initials}</div>
        <span style="font-weight:600;font-size:14px;">${name}</span>
      </div>
      <nav class="se-dn" style="display:flex;align-items:center;gap:36px;">${navHtml}</nav>
      <a href="#contact" onclick="smoothScroll(event,'contact')" style="padding:8px 18px;border-radius:10px;font-size:13px;font-weight:600;background:#2DD4BF;color:#09090B;text-decoration:none;display:inline-flex;align-items:center;">Hire Me</a>
    </div>
  </header>

  <!-- HERO -->
  <section id="home" style="min-height:100vh;display:flex;align-items:center;position:relative;padding-top:72px;overflow:hidden;scroll-margin-top:100px;">
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(circle, rgba(45,212,191,0.11) 1px, transparent 1px);background-size:30px 30px;pointer-events:none;"></div>
    <div aria-hidden="true" style="position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 40%, transparent 25%, #09090B 80%);pointer-events:none;"></div>
    <div style="max-width:1140px;width:100%;margin:0 auto;padding:80px 32px;position:relative;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;" class="se-g2">
        <div style="display:flex;flex-direction:column;gap:24px;">
          <div class="se-f1"><span style="font-size:13px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#A1A1AA;">I'm ${name}</span></div>
          <div class="se-f2">
            <h1 style="font-size:clamp(48px,7vw,84px);font-weight:900;line-height:1.04;letter-spacing:-0.04em;margin:0;">
              <span style="color:#FFFFFF;">${esc(jobTitle.split(' ')[0])}</span><br/>
              <span id="typed-role" style="color:#2DD4BF;">${firstRole}<span class="typing-cursor" aria-hidden="true"></span></span>
            </h1>
          </div>
          <p class="se-f3" style="font-size:18px;line-height:1.75;color:#A1A1AA;max-width:500px;margin:0;">${bio}</p>
          <div class="se-f4" style="display:flex;flex-wrap:wrap;gap:12px;padding-top:4px;">
            ${data.projects?.length > 0 ? `<a href="#projects" onclick="smoothScroll(event,'projects')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;background:#2DD4BF;color:#09090B;text-decoration:none;">View Projects →</a>` : ''}
            ${safeUrl(data.hero.resumeUrl) ? `<a href="${esc(safeUrl(data.hero.resumeUrl))}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;background:rgba(45,212,191,.08);color:#2DD4BF;border:1px solid rgba(45,212,191,.2);text-decoration:none;">Download Resume</a>` : ''}
            <a href="#contact" onclick="smoothScroll(event,'contact')" style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;background:rgba(255,255,255,.04);color:#A1A1AA;border:1px solid rgba(255,255,255,.08);text-decoration:none;">Get in Touch</a>
          </div>
          <div class="se-f5" style="display:flex;gap:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);margin-top:4px;">
            ${[{v:`${experienceList.length || 3}+`,l:'Positions'},{v:`${data.projects?.length || 5}+`,l:'Projects'},{v:'99.9%',l:'Uptime SLA'}].map(s=>`<div><div style="font-size:28px;font-weight:800;letter-spacing:-0.03em;">${esc(s.v)}</div><div style="font-size:14px;color:#71717A;margin-top:2px;font-weight:500;">${esc(s.l)}</div></div>`).join('')}
          </div>
        </div>
        <div class="se-r" style="display:flex;align-items:center;justify-content:center;">
          <div class="se-fl" style="position:relative;width:360px;height:360px;">
            <div class="r1" style="position:absolute;inset:-40px;border-radius:50%;border:1.5px solid rgba(45,212,191,0.18);transform-style:preserve-3d;"></div>
            <div class="r2" style="position:absolute;inset:-120px;border-radius:50%;border:1.5px solid rgba(45,212,191,0.13);transform-style:preserve-3d;"></div>
            <div class="r3" style="position:absolute;inset:-200px;border-radius:50%;border:1.5px solid rgba(45,212,191,0.08);transform-style:preserve-3d;"></div>
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">${avatarHtml}</div>
            ${skillPills}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SKILLS STRIP -->
  ${skillsHtml}

  <!-- PROJECTS -->
  ${projectsHtml}

  <!-- EXPERIENCE & ACHIEVEMENTS -->
  ${(experienceList.length > 0 || achievementsList.length > 0) ? `
  <section id="experience" style="padding:80px 0;border-bottom:1px solid rgba(255,255,255,.04);scroll-margin-top:100px;">
    <div style="max-width:1140px;margin:0 auto;padding:0 32px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;" class="se-g2">
        ${experienceHtml}
        ${achievementsHtml}
      </div>
    </div>
  </section>` : ''}

  <!-- CONTACT -->
  <section id="contact" style="padding:80px 0;scroll-margin-top:100px;">
    <div style="max-width:1140px;margin:0 auto;padding:0 32px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;" class="se-g2">
        <div>
          <div class="echo-heading" data-text="Contact"><h2>Contact</h2></div>
          <p style="font-size:17px;line-height:1.8;color:#A1A1AA;max-width:420px;margin-bottom:36px;">Want to work together? I'd love to hear about your project.</p>
          ${socialsHtml}
          <div style="display:flex;flex-direction:column;gap:16px;">
            ${email ? `<div style="display:flex;align-items:center;gap:20px;"><span style="font-size:13px;font-weight:600;color:#71717A;text-transform:uppercase;letter-spacing:.1em;width:84px;flex-shrink:0;">Email</span><a href="mailto:${esc(data.contact?.email || '')}" style="font-size:15px;color:#A1A1AA;text-decoration:none;">${email}</a></div>` : ''}
            ${location ? `<div style="display:flex;align-items:center;gap:20px;"><span style="font-size:13px;font-weight:600;color:#71717A;text-transform:uppercase;letter-spacing:.1em;width:84px;flex-shrink:0;">Location</span><span style="font-size:15px;color:#A1A1AA;">${location}</span></div>` : ''}
            <div style="display:flex;align-items:center;gap:20px;"><span style="font-size:13px;font-weight:600;color:#71717A;text-transform:uppercase;letter-spacing:.1em;width:84px;flex-shrink:0;">Status</span><span style="font-size:15px;color:#A1A1AA;">Open to opportunities</span></div>
          </div>
        </div>
        <form id="contact-form" style="display:flex;flex-direction:column;gap:20px;" onsubmit="handleFormSubmit(event)">
          <div><label style="display:block;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#71717A;margin-bottom:10px;">Name</label><input type="text" name="name" required placeholder="John Doe" class="se-input" /></div>
          <div><label style="display:block;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#71717A;margin-bottom:10px;">Email</label><input type="email" name="email" required placeholder="john@email.com" class="se-input" /></div>
          <div><label style="display:block;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#71717A;margin-bottom:10px;">Message</label><textarea name="message" required rows="6" placeholder="Tell me about your project..." class="se-input" style="resize:none;"></textarea></div>
          <button type="submit" id="contact-btn" style="padding:14px;border-radius:12px;font-size:14px;font-weight:700;font-family:inherit;border:none;cursor:pointer;background:#2DD4BF;color:#09090B;transition:background .3s,transform .15s;">Send Message</button>
          <p id="form-note" style="display:none;font-size:13px;color:#71717A;text-align:center;">Thanks! Please copy the email above and reach out directly if needed.</p>
        </form>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer style="border-top:1px solid rgba(255,255,255,.06);padding:28px 0;">
    <div style="max-width:1140px;margin:0 auto;padding:0 32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;">
      <span style="font-size:13px;color:#71717A;">&copy; ${year} ${name} &mdash; Built with DevCanvas</span>
      <div style="display:flex;gap:28px;">${navLinks.map(([id,label]) => `<a href="#${id}" onclick="smoothScroll(event,'${id}')" class="nav-link" style="color:#71717A;font-size:13px;">${esc(label)}</a>`).join('')}</div>
    </div>
  </footer>

  <script>
    // Smooth scroll
    function smoothScroll(e, id) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Sticky nav
    window.addEventListener('scroll', function() {
      const nav = document.getElementById('main-nav');
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(9,9,11,.88)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.borderBottom = '1px solid rgba(255,255,255,.06)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = '1px solid transparent';
      }
    });

    // Typewriter effect (static portfolio variant)
    (function() {
      const roles = ${JSON.stringify(rolesRaw.map(r => r.endsWith('.') ? r : r + '.'))};
      const el = document.getElementById('typed-role');
      if (!el || roles.length === 0) return;
      let ri = 0, text = '', deleting = false, paused = false;
      function tick() {
        const cur = roles[ri];
        if (paused) { setTimeout(() => { paused=false; deleting=true; tick(); }, 2200); return; }
        if (deleting && text === '') { deleting=false; ri=(ri+1)%roles.length; }
        if (!deleting && text === cur) { paused=true; tick(); return; }
        text = deleting ? text.slice(0,-1) : cur.slice(0, text.length+1);
        el.innerHTML = text + '<span class="typing-cursor" aria-hidden="true"></span>';
        setTimeout(tick, deleting ? 55 : 105);
      }
      tick();
    })();

    // Contact form: mailto fallback
    function handleFormSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('contact-btn');
      const note = document.getElementById('form-note');
      btn.textContent = 'Message Sent!';
      btn.style.background = '#111113';
      btn.style.color = '#71717A';
      btn.style.cursor = 'default';
      if (note) note.style.display = 'block';
      e.target.reset();
    }
  </script>
</body>
</html>`;
}

// ─── HTML generation for ModernDeveloper template ─────────────────────────────

function generateModernDeveloperHTML(data, images, year) {
  const name = esc(data.hero.logoText || data.hero.name || 'Developer');
  const jobTitle = esc(data.hero.title || 'Full-Stack Engineer');
  const bio = esc(data.hero.bio || '');
  const tagline = esc(data.hero.tagline || '');
  const location = esc(data.contact?.location || data.hero?.location || '');
  const email = esc(data.contact?.email || '');

  const logoChar = (data.hero.logoText || 'A').charAt(0).toUpperCase();
  const logoRest = (data.hero.logoText || '').substring(1);

  const experienceList = (data.achievements || []).filter(a => ['job', 'internship', 'freelance'].includes(a.type));
  const achievementsList = (data.achievements || []).filter(a => a.type === 'achievement');

  // Avatar
  let avatarHtml = '';
  if (images.avatar) {
    const src = images.avatar.useFallback
      ? esc(images.avatar.fallbackSrc)
      : esc(images.avatar.filename);
    avatarHtml = `<img src="${src}" alt="${name}" class="profile-img" />`;
  } else {
    avatarHtml = `<span style="font-size:5rem;font-weight:900;color:#6b7280;">${esc(logoChar)}</span>`;
  }

  // Projects
  const projectsHtml = (data.projects?.length > 0)
    ? `<section id="projects" class="section" style="scroll-margin-top:80px;">
        <div class="container">
          <h2 class="section-title">Projects</h2>
          <div class="projects-grid">
            ${data.projects.map((p, idx) => {
              const projImgInfo = images.projects?.[idx];
              let projImgHtml = '';
              if (projImgInfo) {
                const src = projImgInfo.useFallback ? esc(projImgInfo.fallbackSrc) : esc(projImgInfo.filename);
                projImgHtml = `<div class="project-img-wrap"><img src="${src}" alt="${esc(p.name)}" class="project-img" loading="lazy" /></div>`;
              }
              const liveUrl = safeUrl(p.liveUrl);
              const ghUrl = safeUrl(p.githubUrl);
              return `<div class="project-card">
                ${projImgHtml}
                <div class="project-card-body">
                  <h3 class="project-name">${esc(p.name)}</h3>
                  <p class="project-desc">${esc(p.description)}</p>
                  ${p.techStack?.length > 0 ? `<div class="tech-stack">${p.techStack.map(t=>`<span class="tech-tag">${esc(t)}</span>`).join('')}</div>` : ''}
                  ${p.highlights?.length > 0 ? `<ul class="highlights">${p.highlights.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>` : ''}
                  <div class="project-links">
                    ${liveUrl ? `<a href="${esc(liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-primary">Live Demo ↗</a>` : ''}
                    ${ghUrl ? `<a href="${esc(ghUrl)}" target="_blank" rel="noopener noreferrer" class="btn-secondary">GitHub ↗</a>` : ''}
                  </div>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>`
    : '';

  // Experience & Achievements
  const expAchHtml = ((experienceList.length > 0 || achievementsList.length > 0))
    ? `<section id="experience" class="section" style="scroll-margin-top:80px;">
        <div class="container">
          ${experienceList.length > 0 ? `
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
              ${experienceList.map(exp => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">${esc(exp.startDate)} – ${esc(exp.endDate)}</span>
                    <h3>${esc(exp.title)}</h3>
                    <p class="timeline-org">${esc(exp.organization || '')}</p>
                    ${exp.description ? `<p class="timeline-desc">${esc(exp.description)}</p>` : ''}
                  </div>
                </div>`).join('')}
            </div>` : ''}
          ${achievementsList.length > 0 ? `
            <h2 class="section-title" style="margin-top:48px;">Achievements</h2>
            <div class="achievements-list">
              ${achievementsList.map((a, idx) => `
                <div class="achievement-card">
                  <span class="ach-num">${String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <p class="ach-title">${esc(a.title)}</p>
                    <p class="ach-org">${esc(a.organization || '')}</p>
                    <p class="ach-date">${esc(a.startDate)}</p>
                    ${a.description ? `<p class="ach-desc">${esc(a.description)}</p>` : ''}
                  </div>
                </div>`).join('')}
            </div>` : ''}
        </div>
      </section>`
    : '';

  // Skills
  const skillsHtml = (data.skills?.length > 0)
    ? `<section id="skills" class="section" style="scroll-margin-top:80px;">
        <div class="container">
          <h2 class="section-title">Skills</h2>
          <div class="skills-grid">
            ${data.skills.map(s => `<span class="skill-badge">${esc(s.name)}</span>`).join('')}
          </div>
        </div>
      </section>`
    : '';

  // Socials
  const socialsHtml = (data.hero.socials?.length > 0)
    ? data.hero.socials.map(s => {
        const href = safeUrl(s.url);
        return href
          ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="${esc(socialLabel(s.platform))}">${esc(socialLabel(s.platform))}</a>`
          : '';
      }).join('')
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${name} – ${jobTitle} Portfolio" />
  <title>${name} – Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/style.css" />
  <style>
    :root { --accent: #ccff00; --bg: #050505; --text: #ffffff; --muted: #6b7280; --card-bg: rgba(10,10,10,0.6); --border: rgba(255,255,255,0.1); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; min-height: 100vh; overflow-x: hidden; }

    /* Background orbs */
    .bg-orbs { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
    .orb { position: absolute; border-radius: 50%; filter: blur(120px); }
    .orb-1 { top:-10%;left:-10%;width:40%;height:40%;background:rgba(204,255,0,0.05); animation: float-slow 20s ease-in-out infinite; }
    .orb-2 { bottom:-10%;right:-10%;width:50%;height:50%;background:rgba(204,255,0,0.05); animation: float-slow 20s ease-in-out infinite; animation-delay:-10s; }
    @keyframes float-slow { 0%,100%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(2%,4%) rotate(2deg)} 50%{transform:translate(-1%,2%) rotate(-1deg)} 75%{transform:translate(3%,-2%) rotate(1deg)} }

    /* Nav */
    nav.top-nav { position: sticky; top:0; z-index:50; width:100%; }
    .nav-inner { max-width:1200px; margin:0 auto; padding:24px; display:flex; justify-content:space-between; align-items:center; }
    .logo { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; color:#fff; display:flex; align-items:center; gap:12px; }
    .logo-icon { width:40px;height:40px;border-radius:50%;background:var(--accent);color:#000;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem; }
    .nav-links { display:flex;align-items:center;gap:32px;background:#111;padding:12px 24px;border-radius:999px;border:1px solid rgba(255,255,255,0.05); }
    .nav-links a { font-size:.875rem;font-weight:500;color:#9ca3af;text-decoration:none;transition:color .2s; }
    .nav-links a:hover { color:#fff; }

    /* Sections */
    .section { padding: 80px 0; position: relative; z-index: 10; }
    .container { max-width:1200px; margin:0 auto; padding:0 24px; }
    .section-title { font-family:'Playfair Display',serif; font-size:clamp(2rem,4vw,3rem); font-weight:700; margin-bottom:48px; color:#fff; }
    .section-title span { color:var(--accent); }

    /* Hero */
    #home { min-height:100vh; display:flex; flex-direction:column; }
    .hero-tagline { font-family:'Playfair Display',serif; font-size:clamp(2.5rem,6vw,5rem); font-weight:900; letter-spacing:-0.04em; text-transform:uppercase; text-align:center; color:transparent; background: linear-gradient(to right,#fff,rgba(204,255,0,.6),#fff); background-size:200% auto; -webkit-background-clip:text; background-clip:text; margin-bottom:2.5rem; line-height:1; animation: shimmer 8s ease-in-out infinite; }
    @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .hero-location { display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:24px;color:#9ca3af;font-size:.875rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase; }
    .hero-card { max-width:1050px;width:100%;margin:0 auto;background:rgba(10,10,10,0.6);backdrop-filter:blur(32px);border:1px solid rgba(255,255,255,0.1);border-radius:1.5rem;overflow:hidden;display:flex;flex-wrap:wrap;box-shadow:0 20px 60px rgba(0,0,0,0.8); }
    .hero-card-left { flex:0 0 45%;min-width:280px;min-height:350px;position:relative;background:#050505;overflow:hidden; }
    .profile-img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s ease; }
    .hero-card:hover .profile-img { transform:scale(1.05); }
    .avatar-placeholder { position:absolute;inset:0;display:flex;align-items:center;justify-content:center; }
    .hero-card-img-overlay { position:absolute;inset:0;background:linear-gradient(to top,#000 0%,transparent 60%);opacity:.6; }
    .hero-card-right { flex:1;padding:clamp(2rem,4vw,4rem);display:flex;flex-direction:column;justify-content:center; }
    .hero-title { color:var(--accent);font-weight:900;font-size:clamp(1.5rem,3vw,2.5rem);letter-spacing:.15em;text-transform:uppercase;margin-bottom:1.5rem;text-shadow:0 0 10px rgba(204,255,0,0.3); }
    .hero-bio { color:#9ca3af;font-size:clamp(1rem,1.5vw,1.1rem);line-height:1.75;margin-bottom:2.5rem; }
    .hero-actions { display:flex;flex-wrap:wrap;align-items:center;gap:1.5rem;margin-top:auto; }
    .btn-cta { display:inline-flex;align-items:center;gap:8px;padding:.75rem 2rem;border-radius:999px;font-weight:700;font-size:.875rem;border:1px solid rgba(255,255,255,.2);color:#fff;text-decoration:none;background:transparent;transition:all .3s; }
    .btn-cta:hover { background:var(--accent);color:#000;border-color:var(--accent);box-shadow:0 0 20px rgba(204,255,0,.4); }
    .btn-resume { display:inline-flex;align-items:center;gap:8px;padding:.75rem 2rem;border-radius:999px;font-weight:700;font-size:.875rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#fff;text-decoration:none;transition:all .3s; }
    .btn-resume:hover { background:rgba(255,255,255,.1); }
    .social-links { display:flex;gap:12px;flex-wrap:wrap; }
    .social-btn { display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-size:.8rem;font-weight:600;color:var(--accent);border:1px solid rgba(204,255,0,.2);background:rgba(204,255,0,.05);text-decoration:none;transition:all .2s; }
    .social-btn:hover { background:rgba(204,255,0,.1); }

    /* Projects */
    .projects-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:24px; }
    .project-card { background:rgba(10,10,10,.6);border:1px solid rgba(255,255,255,.1);border-radius:16px;overflow:hidden;transition:all .3s; }
    .project-card:hover { border-color:rgba(204,255,0,.3);transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.5); }
    .project-img-wrap { aspect-ratio:16/9;overflow:hidden; }
    .project-img { width:100%;height:100%;object-fit:cover;transition:transform .5s ease; }
    .project-card:hover .project-img { transform:scale(1.05); }
    .project-card-body { padding:24px; }
    .project-name { font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;margin-bottom:8px; }
    .project-desc { color:#9ca3af;font-size:.9rem;line-height:1.6;margin-bottom:12px; }
    .tech-stack { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px; }
    .tech-tag { padding:3px 10px;border-radius:4px;font-size:.75rem;font-weight:500;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#9ca3af; }
    .highlights { list-style:none;padding:0;margin:0 0 16px;color:#9ca3af;font-size:.9rem;line-height:1.6; }
    .highlights li::before { content:'• ';color:var(--accent); }
    .project-links { display:flex;gap:10px;flex-wrap:wrap; }
    .btn-primary { display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.8rem;font-weight:600;background:rgba(204,255,0,.08);color:var(--accent);border:1px solid rgba(204,255,0,.2);text-decoration:none;transition:all .2s; }
    .btn-primary:hover { background:rgba(204,255,0,.15); }
    .btn-secondary { display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:.8rem;font-weight:600;background:rgba(255,255,255,.04);color:#9ca3af;border:1px solid rgba(255,255,255,.08);text-decoration:none;transition:all .2s; }
    .btn-secondary:hover { background:rgba(255,255,255,.08); }

    /* Timeline */
    .timeline { position:relative;padding-left:28px; }
    .timeline::before { content:'';position:absolute;left:0;top:8px;bottom:0;width:1px;background:rgba(255,255,255,.1); }
    .timeline-item { position:relative;padding-bottom:36px; }
    .timeline-dot { position:absolute;left:-33px;top:8px;width:10px;height:10px;border-radius:50%;background:var(--bg);border:2px solid var(--accent); }
    .timeline-date { display:block;font-size:.8rem;font-weight:600;color:#6b7280;margin-bottom:4px;letter-spacing:.05em; }
    .timeline-content h3 { font-size:1.1rem;font-weight:700;margin-bottom:4px; }
    .timeline-org { color:var(--accent);font-size:.95rem;font-weight:600;margin-bottom:4px; }
    .timeline-desc { color:#9ca3af;font-size:.875rem;margin-top:8px; }

    /* Achievements */
    .achievements-list { display:flex;flex-direction:column;gap:16px; }
    .achievement-card { display:flex;gap:20px;padding:20px;border-radius:14px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06); }
    .ach-num { font-size:2.25rem;font-weight:900;color:rgba(204,255,0,.2);line-height:1;flex-shrink:0;padding-top:2px; }
    .ach-title { font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px; }
    .ach-org { font-size:.875rem;color:#6b7280;margin-bottom:2px; }
    .ach-date { font-size:.8rem;font-weight:600;color:var(--accent); }
    .ach-desc { font-size:.8rem;color:#6b7280;margin-top:8px; }

    /* Skills */
    .skills-grid { display:flex;flex-wrap:wrap;gap:10px; }
    .skill-badge { padding:8px 18px;border-radius:999px;font-size:.875rem;font-weight:600;background:rgba(204,255,0,.08);border:1px solid rgba(204,255,0,.2);color:var(--accent); }

    /* Contact */
    #contact { border-top: 1px solid rgba(255,255,255,.06); }
    .contact-grid { display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start; }
    .contact-info-row { display:flex;align-items:center;gap:16px;margin-bottom:12px; }
    .contact-label { font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#6b7280;width:80px;flex-shrink:0; }
    .contact-value { font-size:.95rem;color:#9ca3af; }
    .contact-form { display:flex;flex-direction:column;gap:20px; }
    .form-group label { display:block;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;margin-bottom:10px; }
    .form-input { width:100%;padding:14px 18px;border-radius:12px;font-size:1rem;font-family:inherit;background:rgba(10,10,10,.8);border:1px solid rgba(255,255,255,.1);color:#fff;outline:none;transition:border-color .2s; }
    .form-input::placeholder { color:#374151; }
    .form-input:focus { border-color:rgba(204,255,0,.4); }
    .btn-send { padding:14px;border-radius:12px;font-size:.9rem;font-weight:700;font-family:inherit;border:none;cursor:pointer;background:var(--accent);color:#000;width:100%;transition:all .2s; }
    .btn-send:hover { opacity:.9; }

    /* Footer */
    footer { border-top:1px solid rgba(255,255,255,.06);padding:28px 24px;text-align:center;color:#6b7280;font-size:.8rem;position:relative;z-index:10; }

    @media(max-width:768px) {
      .nav-links { display:none; }
      .hero-card-left { flex:0 0 100%; min-height:300px; }
      .contact-grid { grid-template-columns:1fr; }
      .projects-grid { grid-template-columns:1fr; }
    }
  </style>
</head>
<body>

  <!-- Background orbs -->
  <div class="bg-orbs" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
  </div>

  <!-- NAV -->
  <nav class="top-nav">
    <div class="nav-inner">
      <div class="logo">
        <div class="logo-icon">${esc(logoChar)}</div>
        <span>${esc(logoRest)}</span>
      </div>
      <div class="nav-links">
        <a href="#home" onclick="smoothScroll(event,'home')">Home</a>
        ${data.projects?.length > 0 ? `<a href="#projects" onclick="smoothScroll(event,'projects')">Projects</a>` : ''}
        ${(experienceList.length > 0 || achievementsList.length > 0) ? `<a href="#experience" onclick="smoothScroll(event,'experience')">Experience</a>` : ''}
        ${data.skills?.length > 0 ? `<a href="#skills" onclick="smoothScroll(event,'skills')">Skills</a>` : ''}
        <a href="#contact" onclick="smoothScroll(event,'contact')">Contact</a>
      </div>
    </div>
  </nav>

  <main>
    <!-- HERO -->
    <section id="home" style="min-height:calc(100vh - 88px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;position:relative;z-index:10;">
      <div class="hero-location">
        <span style="color:var(--accent);font-size:1.25rem;">&#60; &#62;</span>
        <span>${location || 'Developer &amp; Engineer'}</span>
      </div>
      <div style="max-width:1050px;width:100%;margin:0 auto;">
        <h1 class="hero-tagline">${tagline || name}</h1>
        <div class="hero-card">
          <div class="hero-card-left">
            ${images.avatar
              ? (images.avatar.useFallback
                  ? `<img src="${esc(images.avatar.fallbackSrc)}" alt="${name}" class="profile-img" />`
                  : `<img src="${esc(images.avatar.filename)}" alt="${name}" class="profile-img" />`)
              : `<div class="avatar-placeholder"><span style="font-size:5rem;font-weight:900;color:#374151;">${esc(logoChar)}</span></div>`}
            <div class="hero-card-img-overlay"></div>
          </div>
          <div class="hero-card-right">
            <h2 class="hero-title">${jobTitle}</h2>
            <p class="hero-bio">${bio}</p>
            <div class="hero-actions">
              <a href="#contact" onclick="smoothScroll(event,'contact')" class="btn-cta">LET'S BUILD TOGETHER</a>
              ${safeUrl(data.hero.resumeUrl) ? `<a href="${esc(safeUrl(data.hero.resumeUrl))}" target="_blank" rel="noopener noreferrer" class="btn-resume">📄 RESUME</a>` : ''}
              ${socialsHtml ? `<div class="social-links">${socialsHtml}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECTS -->
    ${projectsHtml}

    <!-- EXPERIENCE & ACHIEVEMENTS -->
    ${expAchHtml}

    <!-- SKILLS -->
    ${skillsHtml}

    <!-- CONTACT -->
    <section id="contact" class="section" style="scroll-margin-top:80px;">
      <div class="container">
        <h2 class="section-title">Contact</h2>
        <div class="contact-grid">
          <div>
            <p style="color:#9ca3af;font-size:1rem;line-height:1.75;margin-bottom:32px;">Ready to collaborate? I'd love to hear about your project or idea.</p>
            ${socialsHtml ? `<div class="social-links" style="margin-bottom:32px;">${socialsHtml}</div>` : ''}
            ${email ? `<div class="contact-info-row"><span class="contact-label">Email</span><a href="mailto:${esc(data.contact?.email || '')}" class="contact-value" style="color:#9ca3af;text-decoration:none;">${email}</a></div>` : ''}
            ${location ? `<div class="contact-info-row"><span class="contact-label">Location</span><span class="contact-value">${location}</span></div>` : ''}
            <div class="contact-info-row"><span class="contact-label">Status</span><span class="contact-value">Open to opportunities</span></div>
          </div>
          <form class="contact-form" onsubmit="handleFormSubmit(event)">
            <div class="form-group"><label>Name</label><input type="text" name="name" required placeholder="John Doe" class="form-input" /></div>
            <div class="form-group"><label>Email</label><input type="email" name="email" required placeholder="john@email.com" class="form-input" /></div>
            <div class="form-group"><label>Message</label><textarea name="message" required rows="5" placeholder="Tell me about your project..." class="form-input" style="resize:none;"></textarea></div>
            <button type="submit" class="btn-send" id="contact-btn">Send Message</button>
            <p id="form-note" style="display:none;font-size:.8rem;color:#6b7280;text-align:center;">Thanks! Please email me directly if needed.</p>
          </form>
        </div>
      </div>
    </section>
  </main>

  <footer>&copy; ${year} ${name} &mdash; Built with DevCanvas</footer>

  <script>
    function smoothScroll(e, id) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function handleFormSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('contact-btn');
      const note = document.getElementById('form-note');
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      btn.style.opacity = '.6';
      if (note) note.style.display = 'block';
      e.target.reset();
    }
  </script>
</body>
</html>`;
}

// ─── CSS ───────────────────────────────────────────────────────────────────────

function generateCSS() {
  return `/* DevCanvas Portfolio Export – global reset & utilities */
/* Individual template styles are inlined in index.html for maximum portability */

*, *::before, *::after { box-sizing: border-box; }
html { line-height: 1.15; -webkit-text-size-adjust: 100%; }
body { margin: 0; }
img, video { max-width: 100%; display: block; }
a { background-color: transparent; }
button { cursor: pointer; }

/* Smooth scrolling for all anchor links */
html { scroll-behavior: smooth; }

/* Focus ring for keyboard users */
:focus-visible { outline: 2px solid #2DD4BF; outline-offset: 3px; }

/* Print styles */
@media print {
  .bg-orbs, #main-nav, .top-nav, nav { display: none !important; }
  body { background: white; color: black; }
}
`;
}

// ─── README ───────────────────────────────────────────────────────────────────

function generateReadme(name, template) {
  return `# ${name} – Portfolio

Generated with [DevCanvas](https://dev-canvas-ia.vercel.app/) on ${new Date().toDateString()}.

## Getting Started

1. Extract this ZIP to a folder on your computer.
2. Open **index.html** in any modern browser (Chrome, Firefox, Edge, Safari).
   - No server or build step is required.
   - All styles and scripts are self-contained.
   - Images are included in the **assets/** folder.

## Folder Structure

\`\`\`
portfolio/
├── index.html          ← Main portfolio page
├── styles/
│   └── style.css       ← Global styles and resets
├── assets/
│   ├── avatar.*        ← Profile photo (if uploaded)
│   └── project-*.*/   ← Project images (if uploaded)
└── README.md           ← This file
\`\`\`

## Customisation

Edit **index.html** directly to change content, or update **styles/style.css** for global style tweaks.

## Template

This portfolio was built using the **${template}** template.

## Contact Form

The contact form in the exported HTML uses a simple client-side handler that shows a confirmation
message. To make it functional, replace the \`handleFormSubmit\` JavaScript function with your own
backend endpoint (e.g. Formspree, Netlify Forms, or a custom API).

---

*Portfolio generated by [DevCanvas](https://dev-canvas-ia.vercel.app/) – the AI-powered portfolio builder.*
`;
}

// ─── Main export function ─────────────────────────────────────────────────────

/**
 * Generate and trigger a ZIP download of the portfolio.
 *
 * @param {import('@/types/portfolio').PortfolioData} portfolioData
 * @param {string} templateName  - e.g. 'software-engineer' | 'creative-edge' | 'modern-developer'
 * @param {function} onProgress  - optional callback(status: string)
 */
export async function exportPortfolioZip(portfolioData, templateName, onProgress) {
  const notify = (msg) => { if (typeof onProgress === 'function') onProgress(msg); };

  notify('Preparing images…');

  const zip = new JSZip();
  const assetsFolder = zip.folder('assets');
  const stylesFolder = zip.folder('styles');

  // ── Collect and embed images ──────────────────────────────────────────────

  const images = { avatar: null, projects: [] };

  // Avatar
  const avatarSrc = portfolioData.hero?.avatarUrl;
  if (avatarSrc) {
    notify('Processing profile photo…');
    const result = await processImage(avatarSrc, 'assets/avatar');
    if (result) {
      images.avatar = result;
      if (result.data && result.filename) {
        const filename = result.filename.replace('assets/', '');
        assetsFolder.file(filename, result.data);
      }
    }
  }

  // Project images
  const projects = portfolioData.projects || [];
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const imgSrc = project.images?.[0];
    if (imgSrc) {
      notify(`Processing project image ${i + 1} of ${projects.length}…`);
      const result = await processImage(imgSrc, `assets/project-${i + 1}`);
      if (result) {
        images.projects[i] = result;
        if (result.data && result.filename) {
          const filename = result.filename.replace('assets/', '');
          assetsFolder.file(filename, result.data);
        }
      } else {
        images.projects[i] = null;
      }
    } else {
      images.projects[i] = null;
    }
  }

  // ── Generate HTML ─────────────────────────────────────────────────────────

  notify('Generating HTML…');
  const year = new Date().getFullYear();
  let html;

  if (templateName === 'software-engineer') {
    html = generateDeveloperProHTML(portfolioData, images, year);
  } else {
    // 'creative-edge' and 'modern-developer' both use the ModernDeveloper layout
    html = generateModernDeveloperHTML(portfolioData, images, year);
  }

  // ── Assemble ZIP ──────────────────────────────────────────────────────────

  notify('Assembling ZIP…');
  zip.file('index.html', html);
  stylesFolder.file('style.css', generateCSS());

  const name = portfolioData.hero?.logoText || portfolioData.hero?.name || 'Developer';
  zip.file('README.md', generateReadme(name, templateName));

  // ── Download ──────────────────────────────────────────────────────────────

  notify('Compressing…');
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });

  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${safeName}_portfolio.zip`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 60000);

  notify('Done!');
  return filename;
}

