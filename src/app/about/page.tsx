import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: "Ishan Gupta",
      role: "Founder & Core Architect",
      tag: "[ARCHITECT]",
      photo: "https://i.postimg.cc/KzX2XBJw/Ishan.jpg",
      linkedin: "https://www.linkedin.com/in/ishan-gupta-08686631a/",
    },
    {
      name: "Aparna Jha",
      role: "Product Design Lead",
      tag: "[DESIGNER]",
      photo: "https://i.postimg.cc/tJW7Q93G/aparna.jpg",
      linkedin: "https://www.linkedin.com/in/aparna-jha-58662b304/",
    },
  ];

  const problems = [
    {
      title: "Portfolios stuck in 2020",
      desc: "Developer portfolios haven't evolved. Most still use the same generic templates that scream 'boilerplate' instead of reflecting technical depth.",
    },
    {
      title: "Time is the bottleneck",
      desc: "Between coding, interviewing, and shipping features, building a portfolio from scratch gets pushed to the back burner — forever.",
    },
    {
      title: "Writing about yourself is hard",
      desc: "Translating repository metrics, commit history, and technical achievements into compelling narratives requires a completely different muscle.",
    },
    {
      title: "No true ownership",
      desc: "Most platforms lock you in. Your portfolio becomes a rental, not something you truly own and control.",
    },
  ];

  const superpowers = [
    { title: "High Performance", desc: "Our static site generation guarantees 100/100 Lighthouse performance metrics right out of the box." },
    { title: "GitHub Syncing", desc: "Keep your contributions, repositories, and stars up-to-date in real-time with our hooks." },
    { title: "Tailwind Core", desc: "No complex styling engines. Clean, production-ready Tailwind configuration that you fully own." },
    { title: "Monospace Detailing", desc: "Editorial, technical layout details that fit engineering portfolios perfectly." },
    { title: "Micro-animations", desc: "Subtle, premium physics-based animations that make your work feel interactive and alive." },
    { title: "Complete Ownership", desc: "Export raw Next.js codebase at any time. No proprietary locks, no platform lock-in." },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col custom-cursor font-sans">

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xs border-b border-outline/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center min-h-[44px] font-mono text-xs uppercase tracking-widest text-on-background/60 hover:text-on-background transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 md:pt-32">
        {/* Hero */}
        <section className="py-12 md:py-20 border-b border-primary bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
              ✦ About / Studio Philosophy
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
                  We turn developer code <span className="italic font-normal text-stroke">into visual brands.</span>
                </h1>
              </div>
              <div className="lg:col-span-4 lg:pl-6 pt-2">
                <p className="text-sm md:text-base text-on-background/80 leading-relaxed">
                  PAAS is a curated platform for creators. We believe every portfolio begins with intention — sketched on craft paper, refined with care, and built to last. We shape your work into a premium, editorial presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="border-b border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20">
            <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
              ✦ The Problem
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {problems.map((p, idx) => (
                <div key={idx} className="border border-primary p-8 rounded-sm bg-background transition-all hover:bg-primary/5">
                  <div className="font-mono text-[10px] text-on-background/40 mb-4">[{String(idx + 1).padStart(2, '0')} / PROBLEM]</div>
                  <h3 className="font-serif text-2xl font-semibold mb-3">{p.title}</h3>
                  <p className="text-xs text-on-background/75 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inspiration & Solution */}
        <section className="border-b border-primary bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-6">
                <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
                  ✦ What Inspired Us
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight mb-6">
                  We saw talented developers <span className="italic font-normal text-stroke">ship incredible code</span> onto generic shells.
                </h2>
                <p className="text-sm md:text-base text-on-background/75 leading-relaxed mb-4">
                  Between open-source contributions, GitHub repositories, and technical interviews, developers spend years perfecting their craft — only to present it through templates that look like they were made in 2015.
                </p>
                <p className="text-sm md:text-base text-on-background/75 leading-relaxed">
                  That gap — between the quality of the code and the quality of its presentation — is what sparked PAAS. We wanted to build something that lets developers showcase their work with the same deliberate care they put into writing it.
                </p>
              </div>
              <div className="lg:col-span-6 lg:pl-6">
                <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
                  ✦ Our Solution
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl leading-[1.0] tracking-tight mb-6">
                  Raw engineering data <span className="italic font-normal text-stroke">transformed into premium portfolios.</span>
                </h2>
                <p className="text-sm md:text-base text-on-background/75 leading-relaxed mb-4">
                  PAAS takes your resume, GitHub stats, and project details — then restructures, rewrites, and refines them through AI-powered copywriting. You pick from hand-crafted templates packed with smooth animations, then export clean Next.js code you fully own.
                </p>
                <p className="text-sm md:text-base text-on-background/75 leading-relaxed">
                  Four simple steps. No configuration. No generic templates. Just your work, framed by design that matches the quality of your code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Grid */}
        <section className="border-b border-primary bg-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-outline">
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-on-background/45 mb-4">[METRIC 01]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-on-background/70">Portfolios Deployed</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-on-background/45 mb-4">[METRIC 02]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">500k+</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-on-background/70">Github Repos Synced</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-on-background/45 mb-4">[METRIC 03]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">3</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-on-background/70">Core Premium Layouts</div>
            </div>
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs text-on-background/45 mb-4">[METRIC 04]</div>
              <div className="font-serif text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-on-background/70">Server Uptime</div>
            </div>
          </div>
        </section>

        {/* Our Superpowers */}
        <section className="py-20 md:py-32 border-b border-primary bg-grid-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="mb-16 border-b border-primary pb-10">
              <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
                ✦ Our Capabilities
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                    Engineering skills <span className="italic font-normal text-stroke">refined by design.</span>
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-sm text-on-background/70 leading-relaxed">
                    Our capabilities represent our core philosophy. We construct highly optimized portfolio skeletons that sync natively with your GitHub commits.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {superpowers.map((power, idx) => (
                <div key={idx} className="border border-primary p-8 rounded-sm bg-background transition-all hover:bg-primary/5">
                  <div className="font-mono text-[9px] text-on-background/40 mb-4">[{String(idx + 1).padStart(2, '0')} / PWR]</div>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3">{power.title}</h3>
                  <p className="text-xs text-on-background/75 leading-relaxed">{power.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Minds */}
        <section className="py-20 md:py-32 bg-background border-b border-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="mb-16 border-b border-primary pb-10">
              <div className="font-mono text-xs uppercase tracking-widest text-on-background/60 mb-6">
                ✦ Meet the Minds
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7">
                  <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.0] tracking-tight">
                    The people <span className="italic font-normal">behind the vision.</span>
                  </h2>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-sm text-on-background/70 leading-relaxed">
                    Meet Ishan and Aparna, the minds behind PAAS. Together they set out to fix what they saw as a broken system — developers with incredible code trapped behind generic portfolio shells.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {team.map((member, idx) => (
                <div
                  key={idx}
                  className="border border-primary p-8 bg-background rounded-sm flex flex-col items-center text-center"
                >
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-sm border border-primary overflow-hidden mb-6 bg-primary/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <h3 className="font-serif text-2xl font-semibold mb-1 text-on-background">
                    {member.name}
                  </h3>

                  {member.linkedin && (
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-wider text-on-background/50 hover:text-on-background hover:underline transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.214v6.528zM5.337 7.433a2.066 2.066 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                      LinkedIn
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
