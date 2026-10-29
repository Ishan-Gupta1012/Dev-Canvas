import { PortfolioObject } from './pipeline/8-builder';
import { generateJSON } from '@/lib/llm';

export interface JobDetails {
  title: string;
  company?: string;
  location?: string;
  jobType?: string;
  requiredSkills: string[];
  experienceRequirement?: string;
  educationRequirement?: string;
  description: string;
  otherRequirements?: string;
  industry?: string;
}

export interface JobAnalysisResult {
  matchScore: number;
  scoreBreakdown: {
    skillsScore: number;
    experienceScore: number;
    educationScore: number;
    keywordScore: number;
  };
  matchingSkills: {
    name: string;
    category?: string;
    matchedIn: 'skills' | 'experience' | 'projects' | 'rawText';
  }[];
  missingSkills: {
    name: string;
    category?: string;
    importance: 'critical' | 'preferred';
  }[];
  experienceMatch: {
    score: number;
    required: string;
    candidateSummary: string;
    assessment: string;
    matchingPoints: string[];
    gapsOrUnstated: string[];
    isUnderQualified: boolean;
  };
  educationMatch: {
    score: number;
    required: string;
    candidateSummary: string;
    assessment: string;
    status: 'matched' | 'partial' | 'missing_info' | 'not_specified';
  };
  keywords: {
    matched: string[];
    missing: string[];
    atsReadinessNotes: string;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    priority: 'high' | 'medium' | 'low';
    category: 'skills' | 'experience' | 'keywords' | 'formatting' | 'education';
    title: string;
    action: string;
    impact: string;
  }[];
  jobSnapshot: {
    title: string;
    company: string;
    location: string;
    jobType: string;
    keySkillsSummary: string[];
  };
  resumeSnapshot: {
    fileName: string;
    fileSize?: string;
    candidateName?: string;
    totalSkillsCount: number;
    totalExperienceYears?: string;
  };
}

// Comprehensive taxonomy of tech skills and domain keywords
const KNOWN_SKILLS_TAXONOMY: { name: string; category: string; aliases: string[] }[] = [
  // Languages
  { name: 'JavaScript', category: 'Languages', aliases: ['javascript', 'js', 'es6', 'es2020', 'ecmascript'] },
  { name: 'TypeScript', category: 'Languages', aliases: ['typescript', 'ts'] },
  { name: 'Python', category: 'Languages', aliases: ['python', 'py', 'python3'] },
  { name: 'Java', category: 'Languages', aliases: ['java', 'jdk', 'jvm'] },
  { name: 'C++', category: 'Languages', aliases: ['c++', 'cpp'] },
  { name: 'C#', category: 'Languages', aliases: ['c#', 'csharp', 'dotnet', '.net'] },
  { name: 'Go', category: 'Languages', aliases: ['golang', 'go lang'] },
  { name: 'Rust', category: 'Languages', aliases: ['rust', 'rustlang'] },
  { name: 'PHP', category: 'Languages', aliases: ['php'] },
  { name: 'Ruby', category: 'Languages', aliases: ['ruby', 'ruby on rails'] },
  { name: 'Swift', category: 'Languages', aliases: ['swift', 'swiftui', 'ios'] },
  { name: 'Kotlin', category: 'Languages', aliases: ['kotlin', 'android'] },
  { name: 'SQL', category: 'Languages', aliases: ['sql', 't-sql', 'pl/sql'] },

  // Frontend
  { name: 'React', category: 'Frontend', aliases: ['react', 'react.js', 'reactjs'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['next.js', 'nextjs', 'next js'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vue.js', 'vuejs', 'nuxt'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs'] },
  { name: 'HTML5', category: 'Frontend', aliases: ['html', 'html5'] },
  { name: 'CSS3', category: 'Frontend', aliases: ['css', 'css3'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { name: 'Sass / SCSS', category: 'Frontend', aliases: ['sass', 'scss'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux', 'redux-toolkit', 'rtk'] },
  { name: 'GraphQL', category: 'Frontend', aliases: ['graphql', 'apollo', 'relay'] },
  { name: 'Webpack', category: 'Frontend', aliases: ['webpack', 'vite', 'turbopack'] },

  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'node.js', 'nodejs'] },
  { name: 'Express.js', category: 'Backend', aliases: ['express', 'express.js', 'expressjs'] },
  { name: 'NestJS', category: 'Backend', aliases: ['nestjs', 'nest.js'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fastapi', 'fast api'] },
  { name: 'Django', category: 'Backend', aliases: ['django', 'drf'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring', 'spring boot', 'springboot'] },
  { name: 'REST APIs', category: 'Backend', aliases: ['rest', 'restful', 'rest api', 'rest apis'] },
  { name: 'Microservices', category: 'Backend', aliases: ['microservices', 'microservice', 'distributed systems'] },
  { name: 'gRPC', category: 'Backend', aliases: ['grpc', 'protocol buffers', 'protobuf'] },

  // Databases
  { name: 'PostgreSQL', category: 'Databases', aliases: ['postgres', 'postgresql'] },
  { name: 'MySQL', category: 'Databases', aliases: ['mysql', 'mariadb'] },
  { name: 'MongoDB', category: 'Databases', aliases: ['mongodb', 'mongo'] },
  { name: 'Redis', category: 'Databases', aliases: ['redis'] },
  { name: 'Elasticsearch', category: 'Databases', aliases: ['elasticsearch', 'elastic search', 'opensearch'] },
  { name: 'Supabase', category: 'Databases', aliases: ['supabase'] },
  { name: 'Firebase', category: 'Databases', aliases: ['firebase', 'firestore'] },
  { name: 'DynamoDB', category: 'Databases', aliases: ['dynamodb', 'dynamo'] },
  { name: 'Prisma', category: 'Databases', aliases: ['prisma', 'orm', 'typeorm', 'drizzle'] },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud & DevOps', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'cloudfront'] },
  { name: 'Docker', category: 'Cloud & DevOps', aliases: ['docker', 'containerization', 'containers'] },
  { name: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['kubernetes', 'k8s'] },
  { name: 'CI/CD', category: 'Cloud & DevOps', aliases: ['ci/cd', 'ci cd', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'GCP', category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { name: 'Azure', category: 'Cloud & DevOps', aliases: ['azure', 'microsoft azure'] },
  { name: 'Terraform', category: 'Cloud & DevOps', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'Linux', category: 'Cloud & DevOps', aliases: ['linux', 'unix', 'bash', 'shell'] },
  { name: 'Git', category: 'Cloud & DevOps', aliases: ['git', 'github', 'gitlab'] },

  // AI & Data
  { name: 'Machine Learning', category: 'AI & Data', aliases: ['machine learning', 'ml', 'deep learning'] },
  { name: 'PyTorch', category: 'AI & Data', aliases: ['pytorch', 'torch'] },
  { name: 'TensorFlow', category: 'AI & Data', aliases: ['tensorflow', 'tf', 'keras'] },
  { name: 'Pandas', category: 'AI & Data', aliases: ['pandas', 'numpy', 'scipy', 'scikit-learn'] },
  { name: 'LLMs / Generative AI', category: 'AI & Data', aliases: ['llm', 'llms', 'generative ai', 'openai', 'gemini', 'claude', 'langchain', 'rag'] },

  // Methodologies & Soft Skills
  { name: 'Agile / Scrum', category: 'Practices', aliases: ['agile', 'scrum', 'kanban', 'sprint'] },
  { name: 'Unit Testing', category: 'Practices', aliases: ['unit testing', 'jest', 'cypress', 'playwright', 'testing', 'tdd'] },
  { name: 'System Design', category: 'Practices', aliases: ['system design', 'software architecture', 'scalability'] },
  { name: 'Performance Optimization', category: 'Practices', aliases: ['performance optimization', 'caching', 'web vitals', 'profiling'] },
  { name: 'Cross-functional Collaboration', category: 'Soft Skills', aliases: ['collaboration', 'cross-functional', 'communication', 'teamwork', 'leadership'] },
];

/**
 * Normalizes text for matching tokens
 */
function normalize(text: string): string {
  return (text || '').toLowerCase().replace(/[\r\n\t]+/g, ' ');
}

/**
 * Checks if a skill or any of its aliases exists in text
 */
function textContainsSkill(haystack: string, skillItem: { name: string; aliases: string[] }): boolean {
  const normHaystack = ` ${normalize(haystack)} `;
  for (const alias of [skillItem.name.toLowerCase(), ...skillItem.aliases]) {
    // Escaped regex word boundary
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(normHaystack)) {
      return true;
    }
  }
  return false;
}

/**
 * Auto-extracts structured fields from raw Job Description text
 */
export function extractJobDetailsFromText(rawText: string): Partial<JobDetails> {
  const details: Partial<JobDetails> = {
    title: '',
    company: '',
    location: '',
    jobType: '',
    requiredSkills: [],
    experienceRequirement: '',
    educationRequirement: '',
    description: rawText,
  };

  if (!rawText || !rawText.trim()) return details;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Look for Title
  const titleLine = lines.find(l => /^(?:job\s*title|role|position|title)\s*[:\-]\s*(.+)$/i.test(l));
  if (titleLine) {
    const match = titleLine.match(/^(?:job\s*title|role|position|title)\s*[:\-]\s*(.+)$/i);
    if (match?.[1]) details.title = match[1].trim();
  } else if (lines.length > 0) {
    // Check first line if short and looks like a title
    const firstLine = lines[0];
    if (firstLine.length < 80 && /(developer|engineer|designer|manager|specialist|architect|consultant|analyst|intern|lead|director)/i.test(firstLine)) {
      details.title = firstLine.replace(/^[#*\-•\s]+/, '').trim();
    }
  }

  // 2. Look for Company
  const companyLine = lines.find(l => /^(?:company|organization|employer)\s*[:\-]\s*(.+)$/i.test(l));
  if (companyLine) {
    const match = companyLine.match(/^(?:company|organization|employer)\s*[:\-]\s*(.+)$/i);
    if (match?.[1]) details.company = match[1].trim();
  } else {
    const atMatch = rawText.match(/\bat\s+([A-Z][A-Za-z0-9&.\- ]{2,30})\b(?:\s+is\s+hiring|\s+is\s+looking|\s+team)/);
    if (atMatch?.[1]) {
      details.company = atMatch[1].trim();
    }
  }

  // 3. Look for Location
  const locLine = lines.find(l => /^(?:location|workplace|office)\s*[:\-]\s*(.+)$/i.test(l));
  if (locLine) {
    const match = locLine.match(/^(?:location|workplace|office)\s*[:\-]\s*(.+)$/i);
    if (match?.[1]) details.location = match[1].trim();
  } else if (/remote/i.test(rawText)) {
    details.location = 'Remote';
  } else if (/hybrid/i.test(rawText)) {
    details.location = 'Hybrid';
  }

  // 4. Look for Job Type
  if (/\b(?:internship|intern)\b/i.test(rawText)) {
    details.jobType = 'Internship';
  } else if (/\bcontract\b/i.test(rawText)) {
    details.jobType = 'Contract';
  } else if (/\bpart[\s-]time\b/i.test(rawText)) {
    details.jobType = 'Part-time';
  } else if (/\bfull[\s-]time\b/i.test(rawText)) {
    details.jobType = 'Full-time';
  }

  // 5. Look for Experience
  const expMatch = rawText.match(/(\d+\+?(?:\s*(?:-|to)\s*\d+)?\s*(?:years?|yrs?)(?:\s*of\s*(?:relevant\s*)?experience)?)/i);
  if (expMatch?.[1]) {
    details.experienceRequirement = expMatch[1].trim();
  }

  // 6. Look for Education
  const eduMatch = rawText.match(/(bachelor'?s?|master'?s?|ph\.?d|b\.?s\.?|m\.?s\.?|degree\s+in\s+[a-zA-Z\s]+)/i);
  if (eduMatch?.[1]) {
    details.educationRequirement = eduMatch[1].trim();
  }

  // 7. Extract Skills from taxonomy
  const detectedSkills: string[] = [];
  for (const skill of KNOWN_SKILLS_TAXONOMY) {
    if (textContainsSkill(rawText, skill)) {
      detectedSkills.push(skill.name);
    }
  }
  details.requiredSkills = detectedSkills.slice(0, 15);

  return details;
}

/**
 * Calculates candidate years of experience from structured resume
 */
function parseCandidateExperience(resume: PortfolioObject, rawText: string): { years: number; summary: string } {
  let totalMonths = 0;
  const currentYear = new Date().getFullYear();

  if (resume.experience && resume.experience.length > 0) {
    for (const exp of resume.experience) {
      const dur = (exp.duration || '').toLowerCase();
      // Look for e.g. "2021 - 2024" or "Jan 2022 - Present"
      const yearMatches = dur.match(/\b(20\d{2}|19\d{2})\b/g);
      if (yearMatches && yearMatches.length >= 2) {
        const start = parseInt(yearMatches[0], 10);
        const end = parseInt(yearMatches[1], 10);
        if (end >= start) {
          totalMonths += (end - start) * 12;
          continue;
        }
      } else if (yearMatches && yearMatches.length === 1 && /present|current/i.test(dur)) {
        const start = parseInt(yearMatches[0], 10);
        totalMonths += Math.max(1, (currentYear - start)) * 12;
        continue;
      }

      // Check for e.g. "2 yrs" or "6 mos"
      const yrMatch = dur.match(/(\d+)\s*(?:years?|yrs?)/i);
      const moMatch = dur.match(/(\d+)\s*(?:months?|mos?)/i);
      if (yrMatch) totalMonths += parseInt(yrMatch[1], 10) * 12;
      if (moMatch) totalMonths += parseInt(moMatch[1], 10);

      // If duration is unspecified, give credit for typical role duration (~1 year)
      if (!yrMatch && !moMatch && (!yearMatches || yearMatches.length === 0)) {
        totalMonths += 12;
      }
    }
  }

  // If no structured experience, check rawText for mentions like "X years of experience"
  if (totalMonths === 0) {
    const rawExpMatch = rawText.match(/(\d+)\+?\s*years?\s*(?:of)?\s*experience/i);
    if (rawExpMatch) {
      totalMonths = parseInt(rawExpMatch[1], 10) * 12;
    }
  }

  const years = Math.round((totalMonths / 12) * 10) / 10;
  const count = resume.experience ? resume.experience.length : 0;
  
  let summary = '';
  if (years > 0) {
    summary = `~${years} years across ${count} role${count === 1 ? '' : 's'}`;
  } else if (count > 0) {
    summary = `${count} role${count === 1 ? '' : 's'} documented (dates unspecified)`;
  } else {
    summary = 'No professional roles explicitly found (project/academic background)';
  }

  return { years, summary };
}

/**
 * Deterministic matching engine that evaluates resume against job details
 */
export function analyzeResumeAgainstJobDeterministic(
  rawResumeText: string,
  structuredResume: PortfolioObject,
  jobDetails: JobDetails,
  fileName: string = 'Resume.pdf',
  fileSize: string = '120 KB'
): JobAnalysisResult {
  const normResume = normalize(rawResumeText);
  const normJD = normalize(jobDetails.description + ' ' + (jobDetails.otherRequirements || ''));

  // Collect all skills declared on the job
  const targetSkillsSet = new Map<string, { category: string; importance: 'critical' | 'preferred' }>();

  // Add explicit skills
  if (jobDetails.requiredSkills && jobDetails.requiredSkills.length > 0) {
    for (const sk of jobDetails.requiredSkills) {
      const clean = sk.trim();
      if (!clean) continue;
      const taxMatch = KNOWN_SKILLS_TAXONOMY.find(k => 
        k.name.toLowerCase() === clean.toLowerCase() || k.aliases.includes(clean.toLowerCase())
      );
      targetSkillsSet.set(taxMatch ? taxMatch.name : clean, {
        category: taxMatch ? taxMatch.category : 'General',
        importance: 'critical'
      });
    }
  }

  // Scan JD text for known skills
  for (const item of KNOWN_SKILLS_TAXONOMY) {
    if (textContainsSkill(normJD, item)) {
      if (!targetSkillsSet.has(item.name)) {
        targetSkillsSet.set(item.name, {
          category: item.category,
          importance: 'preferred'
        });
      }
    }
  }

  // Fallback if no skills could be found from JD
  if (targetSkillsSet.size === 0) {
    targetSkillsSet.set('Problem Solving', { category: 'Soft Skills', importance: 'critical' });
    targetSkillsSet.set('Communication', { category: 'Soft Skills', importance: 'critical' });
  }

  // Collect candidate skills from resume
  const candidateSkillsFound = new Set<string>();
  const candidateSkillsSources = new Map<string, 'skills' | 'experience' | 'projects' | 'rawText'>();

  // 1. Check structured skills
  if (structuredResume.skills && Array.isArray(structuredResume.skills)) {
    for (const group of structuredResume.skills) {
      for (const item of group.items || []) {
        const clean = item.trim();
        candidateSkillsFound.add(clean.toLowerCase());
        candidateSkillsSources.set(clean.toLowerCase(), 'skills');
      }
    }
  }

  // 2. Check structured projects
  if (structuredResume.projects && Array.isArray(structuredResume.projects)) {
    for (const proj of structuredResume.projects) {
      for (const t of proj.technologies || []) {
        candidateSkillsFound.add(t.toLowerCase());
        if (!candidateSkillsSources.has(t.toLowerCase())) {
          candidateSkillsSources.set(t.toLowerCase(), 'projects');
        }
      }
    }
  }

  // 3. Check structured experience
  if (structuredResume.experience && Array.isArray(structuredResume.experience)) {
    for (const exp of structuredResume.experience) {
      for (const t of exp.technologies || []) {
        candidateSkillsFound.add(t.toLowerCase());
        if (!candidateSkillsSources.has(t.toLowerCase())) {
          candidateSkillsSources.set(t.toLowerCase(), 'experience');
        }
      }
    }
  }

  // Evaluate matching vs missing skills
  const matchingSkills: JobAnalysisResult['matchingSkills'] = [];
  const missingSkills: JobAnalysisResult['missingSkills'] = [];

  let criticalTotal = 0;
  let criticalMatched = 0;
  let preferredTotal = 0;
  let preferredMatched = 0;

  for (const [skillName, meta] of targetSkillsSet.entries()) {
    const isCritical = meta.importance === 'critical';
    if (isCritical) criticalTotal++;
    else preferredTotal++;

    // Check if skill is in candidate resume
    const taxMatch = KNOWN_SKILLS_TAXONOMY.find(k => k.name.toLowerCase() === skillName.toLowerCase());
    const aliases = taxMatch ? taxMatch.aliases : [skillName.toLowerCase()];

    let matched = false;
    let matchedIn: 'skills' | 'experience' | 'projects' | 'rawText' = 'rawText';

    for (const alias of aliases) {
      if (candidateSkillsFound.has(alias)) {
        matched = true;
        matchedIn = candidateSkillsSources.get(alias) || 'skills';
        break;
      }
    }

    if (!matched) {
      if (taxMatch ? textContainsSkill(normResume, taxMatch) : textContainsSkill(normResume, { name: skillName, aliases: [] })) {
        matched = true;
        matchedIn = 'rawText';
      }
    }

    if (matched) {
      matchingSkills.push({
        name: skillName,
        category: meta.category,
        matchedIn: matchedIn
      });
      if (isCritical) criticalMatched++;
      else preferredMatched++;
    } else {
      missingSkills.push({
        name: skillName,
        category: meta.category,
        importance: meta.importance
      });
    }
  }

  // Skills Score: weighted critical vs preferred
  const skillsScore = Math.round(
    criticalTotal > 0
      ? (criticalMatched / criticalTotal) * 80 + (preferredTotal > 0 ? (preferredMatched / preferredTotal) * 20 : 20)
      : (matchingSkills.length / Math.max(1, targetSkillsSet.size)) * 100
  );

  // Evaluate Experience
  const candExp = parseCandidateExperience(structuredResume, rawResumeText);
  let reqYears = 0;
  const reqMatch = (jobDetails.experienceRequirement || '').match(/(\d+)/);
  if (reqMatch) {
    reqYears = parseInt(reqMatch[1], 10);
  } else {
    // Check description for senior / junior
    if (/senior|lead|principal|staff/i.test(jobDetails.title + ' ' + jobDetails.description)) {
      reqYears = 5;
    } else if (/junior|entry|associate|graduate/i.test(jobDetails.title + ' ' + jobDetails.description)) {
      reqYears = 1;
    } else if (/intern/i.test(jobDetails.title + ' ' + (jobDetails.jobType || ''))) {
      reqYears = 0;
    } else {
      reqYears = 2; // general default mid-level
    }
  }

  const isUnderQualified = candExp.years > 0 && reqYears > 0 && candExp.years < (reqYears * 0.7);
  let experienceScore = 100;
  if (reqYears > 0) {
    if (candExp.years >= reqYears) {
      experienceScore = 95;
    } else if (candExp.years > 0) {
      experienceScore = Math.max(30, Math.round((candExp.years / reqYears) * 90));
    } else {
      // Cand experience not explicitly quantified
      experienceScore = (structuredResume.experience && structuredResume.experience.length > 0) ? 65 : 45;
    }
  }

  const matchingPoints: string[] = [];
  const gapsOrUnstated: string[] = [];

  if (candExp.years >= reqYears && reqYears > 0) {
    matchingPoints.push(`Candidate possesses ~${candExp.years} years of demonstrated background, meeting or exceeding the requested ${reqYears}+ years.`);
  } else if (candExp.years > 0 && reqYears > 0) {
    gapsOrUnstated.push(`Qualification Gap: Resume reflects ~${candExp.years} years vs ${reqYears}+ years requested in job criteria.`);
  }

  if (structuredResume.experience && structuredResume.experience.length > 0) {
    const roles = structuredResume.experience.map(e => e.role || e.company).filter(Boolean);
    matchingPoints.push(`Relevant experience roles detected: ${roles.slice(0, 3).join(', ')}.`);
  } else {
    gapsOrUnstated.push('Missing Information: No formal work history entries detected. Relevant projects and internships should be detailed with timelines.');
  }

  const experienceAssessment = isUnderQualified
    ? `The job specifies ${reqYears}+ years of experience. Your resume shows ${candExp.summary}. Be sure to highlight high-impact contributions and technical depth to bridge this gap.`
    : `Experience alignment is positive. Your background (${candExp.summary}) aligns with the ${jobDetails.title} role expectations.`;

  // Evaluate Education
  let educationScore = 85;
  let educationStatus: 'matched' | 'partial' | 'missing_info' | 'not_specified' = 'not_specified';
  let educationAssessment = '';
  const candEduSummary = structuredResume.education && structuredResume.education.length > 0
    ? structuredResume.education.map(e => `${e.degree || 'Degree'} from ${e.institution || 'University'}`).join('; ')
    : 'No explicit education records detected';

  const reqEdu = (jobDetails.educationRequirement || '').toLowerCase();
  const hasCandEdu = structuredResume.education && structuredResume.education.length > 0;

  if (reqEdu.trim()) {
    if (!hasCandEdu) {
      educationStatus = 'missing_info';
      educationScore = 50;
      educationAssessment = `Missing Information: Job mentions "${jobDetails.educationRequirement}", but no degrees are listed in your resume.`;
    } else {
      const isCsOrEng = /computer\s*science|software|engineering|information\s*technology|math/i.test(normResume);
      const isMaster = /master|m\.?s|m\.?tech/i.test(candEduSummary);
      const isBachelor = /bachelor|b\.?s|b\.?tech|b\.?e/i.test(candEduSummary);

      if (reqEdu.includes('master') && !isMaster) {
        educationStatus = 'partial';
        educationScore = 75;
        educationAssessment = 'Candidate holds a Bachelor/undergraduate degree; position prefers a Master’s degree.';
      } else if (isCsOrEng || isBachelor || isMaster) {
        educationStatus = 'matched';
        educationScore = 95;
        educationAssessment = 'Education profile matches or satisfies the academic requirements of this position.';
      } else {
        educationStatus = 'partial';
        educationScore = 80;
        educationAssessment = 'Degree identified, but discipline alignment is slightly differentiated from typical tech specifications.';
      }
    }
  } else {
    educationStatus = hasCandEdu ? 'matched' : 'not_specified';
    educationScore = hasCandEdu ? 90 : 70;
    educationAssessment = hasCandEdu 
      ? `Candidate holds valid credentials: ${candEduSummary}. No strict restrictive degree specified by employer.`
      : 'No formal degree requirement specified by the employer.';
  }

  // Keywords Analysis (ATS density)
  const jobKeywordsToWatch = [
    'scalability', 'architecture', 'agile', 'scrum', 'performance',
    'security', 'rest api', 'ci/cd', 'cloud', 'leadership', 'collaboration',
    'unit test', 'cross-functional', 'optimization', 'code review', 'debugging',
    'deployment', 'observability', 'analytics', 'docker', 'kubernetes'
  ];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of jobKeywordsToWatch) {
    if (normJD.includes(kw)) {
      if (normResume.includes(kw)) {
        matchedKeywords.push(kw.toUpperCase());
      } else {
        missingKeywords.push(kw.toUpperCase());
      }
    }
  }

  // Add missing critical skills as missing keywords
  for (const sk of missingSkills) {
    if (!missingKeywords.includes(sk.name.toUpperCase())) {
      missingKeywords.push(sk.name.toUpperCase());
    }
  }
  for (const sk of matchingSkills) {
    if (!matchedKeywords.includes(sk.name.toUpperCase())) {
      matchedKeywords.push(sk.name.toUpperCase());
    }
  }

  const keywordScore = Math.max(30, Math.min(100, Math.round(
    matchedKeywords.length / Math.max(1, (matchedKeywords.length + missingKeywords.length)) * 100
  )));

  // Overall Match Score (Weighted)
  const overallScore = Math.round(
    Math.min(99, Math.max(25,
      skillsScore * 0.40 +
      experienceScore * 0.30 +
      educationScore * 0.15 +
      keywordScore * 0.15
    ))
  );

  // Generate Strengths
  const strengths: string[] = [];
  if (matchingSkills.length > 0) {
    const topSkills = matchingSkills.slice(0, 4).map(s => s.name).join(', ');
    strengths.push(`Direct alignment on core technical capabilities: ${topSkills}.`);
  }
  if (candExp.years >= reqYears && reqYears > 0) {
    strengths.push(`Meets or exceeds the professional tenure requirement for ${jobDetails.title}.`);
  }
  if (structuredResume.projects && structuredResume.projects.length >= 2) {
    strengths.push(`Strong portfolio of hands-on projects demonstrating practical implementation skills.`);
  }
  if (matchedKeywords.length >= 3) {
    strengths.push(`Good ATS keyword density across modern engineering methodologies (${matchedKeywords.slice(0, 3).join(', ')}).`);
  }
  if (strengths.length === 0) {
    strengths.push('Clean resume structure with identifiable technical sections.');
  }

  // Generate Weaknesses
  const weaknesses: string[] = [];
  if (missingSkills.some(s => s.importance === 'critical')) {
    const critMissing = missingSkills.filter(s => s.importance === 'critical').map(s => s.name).slice(0, 3).join(', ');
    weaknesses.push(`Missing mandatory requirements specified in the job posting: ${critMissing}.`);
  }
  if (gapsOrUnstated.length > 0) {
    weaknesses.push(...gapsOrUnstated);
  }
  if (missingKeywords.length > 3) {
    weaknesses.push(`Low ATS density on critical domain keywords: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Minor discrepancies in keyword phrasing compared to the exact JD terminology.');
  }

  // Generate Actionable Suggestions
  const suggestions: JobAnalysisResult['suggestions'] = [];

  // High priority: missing critical skills
  const critList = missingSkills.filter(s => s.importance === 'critical').map(s => s.name);
  if (critList.length > 0) {
    suggestions.push({
      priority: 'high',
      category: 'skills',
      title: `Integrate Missing Core Skills (${critList.slice(0, 3).join(', ')})`,
      action: `Explicitly add ${critList.slice(0, 3).join(', ')} to your Skills section and describe practical use cases in your project bullets.`,
      impact: 'Eliminates automatic ATS screening rejection by satisfying mandatory skill filters.'
    });
  }

  // High/Medium priority: Experience & Metrics
  suggestions.push({
    priority: 'high',
    category: 'experience',
    title: `Tailor Bullet Points to Target Role (${jobDetails.title})`,
    action: `Rewrite 2-3 past accomplishment statements to lead with action verbs and quantifiable results (e.g., "Reduced latency by 35% using ${matchingSkills[0]?.name || 'modern tools'}").`,
    impact: 'Demonstrates senior-level business value to hiring managers rather than passive task listings.'
  });

  // Medium priority: ATS Keyword insertion
  if (missingKeywords.length > 0) {
    suggestions.push({
      priority: 'medium',
      category: 'keywords',
      title: `Sprinkle ATS Keywords from ${jobDetails.company || 'the Target Company'}`,
      action: `Incorporate keywords like "${missingKeywords.slice(0, 3).join('", "')}" in your work experience summaries or project descriptions.`,
      impact: 'Boosts resume searchability and recruiter relevancy score.'
    });
  }

  // Low priority: Formatting / Title Alignment
  suggestions.push({
    priority: 'low',
    category: 'formatting',
    title: `Align Headline / Professional Summary with "${jobDetails.title}"`,
    action: `Ensure your resume title or summary explicitly matches "${jobDetails.title}" so human recruiters immediately recognize your targeted application.`,
    impact: 'Captures the recruiter’s attention within the initial 6-second scan.'
  });

  return {
    matchScore: overallScore,
    scoreBreakdown: {
      skillsScore,
      experienceScore,
      educationScore,
      keywordScore
    },
    matchingSkills,
    missingSkills,
    experienceMatch: {
      score: experienceScore,
      required: jobDetails.experienceRequirement || `${reqYears}+ years (industry standard)`,
      candidateSummary: candExp.summary,
      assessment: experienceAssessment,
      matchingPoints,
      gapsOrUnstated,
      isUnderQualified
    },
    educationMatch: {
      score: educationScore,
      required: jobDetails.educationRequirement || 'Not strictly specified (relevant background)',
      candidateSummary: candEduSummary,
      assessment: educationAssessment,
      status: educationStatus
    },
    keywords: {
      matched: matchedKeywords,
      missing: missingKeywords,
      atsReadinessNotes: `Identified ${matchedKeywords.length} matching keywords and ${missingKeywords.length} missing keywords relevant to this opening.`
    },
    strengths,
    weaknesses,
    suggestions,
    jobSnapshot: {
      title: jobDetails.title,
      company: jobDetails.company || 'Not specified',
      location: jobDetails.location || 'Flexible',
      jobType: jobDetails.jobType || 'Full-time',
      keySkillsSummary: Array.from(targetSkillsSet.keys()).slice(0, 8)
    },
    resumeSnapshot: {
      fileName: fileName,
      fileSize: fileSize,
      candidateName: structuredResume.personal?.name || 'Candidate',
      totalSkillsCount: candidateSkillsFound.size,
      totalExperienceYears: candExp.years > 0 ? `${candExp.years} years` : 'Unspecified'
    }
  };
}

/**
 * Top-level Orchestrator: Runs Gemini AI analysis if API key is configured,
 * seamlessly falling back to high-fidelity deterministic engine.
 */
export async function analyzeResumeAgainstJob(
  rawResumeText: string,
  structuredResume: PortfolioObject,
  jobDetails: JobDetails,
  fileName: string = 'Resume.pdf',
  fileSize: string = '120 KB'
): Promise<JobAnalysisResult> {
  const fallback = analyzeResumeAgainstJobDeterministic(
    rawResumeText,
    structuredResume,
    jobDetails,
    fileName,
    fileSize
  );

  // Check if GEMINI_API_KEY is available
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1);
  if (!hasGemini) {
    return fallback;
  }

  try {
    const prompt = `
You are an expert technical recruiter and ATS parsing specialist.
Compare this candidate's uploaded resume against the specific job opening below.

CRITICAL RULES:
1. Base the analysis STRICTLY on the actual resume text and the provided job description.
2. DO NOT invent skills, experience, or job requirements not present in either text.
3. Clearly distinguish between MISSING INFORMATION (unstated in the resume) vs GENUINELY MISSING QUALIFICATIONS (e.g., candidate has 1 year experience vs 5 years required).
4. Provide specific, tailored, actionable suggestions for this specific job opening (${jobDetails.title} at ${jobDetails.company || 'the hiring company'}).
5. Return ONLY a valid JSON object matching this exact schema:

{
  "matchScore": number (0-100),
  "scoreBreakdown": {
    "skillsScore": number (0-100),
    "experienceScore": number (0-100),
    "educationScore": number (0-100),
    "keywordScore": number (0-100)
  },
  "matchingSkills": [
    { "name": string, "category": string, "matchedIn": "skills" | "experience" | "projects" | "rawText" }
  ],
  "missingSkills": [
    { "name": string, "category": string, "importance": "critical" | "preferred" }
  ],
  "experienceMatch": {
    "score": number (0-100),
    "required": string,
    "candidateSummary": string,
    "assessment": string,
    "matchingPoints": string[],
    "gapsOrUnstated": string[],
    "isUnderQualified": boolean
  },
  "educationMatch": {
    "score": number (0-100),
    "required": string,
    "candidateSummary": string,
    "assessment": string,
    "status": "matched" | "partial" | "missing_info" | "not_specified"
  },
  "keywords": {
    "matched": string[],
    "missing": string[],
    "atsReadinessNotes": string
  },
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": [
    {
      "priority": "high" | "medium" | "low",
      "category": "skills" | "experience" | "keywords" | "formatting" | "education",
      "title": string,
      "action": string,
      "impact": string
    }
  ]
}

--- JOB OPENING DETAILS ---
Title: ${jobDetails.title}
Company: ${jobDetails.company || 'Not specified'}
Location: ${jobDetails.location || 'Not specified'}
Job Type: ${jobDetails.jobType || 'Full-time'}
Required Skills: ${jobDetails.requiredSkills.join(', ')}
Experience Requirement: ${jobDetails.experienceRequirement || 'Not specified'}
Education Requirement: ${jobDetails.educationRequirement || 'Not specified'}
Other Requirements: ${jobDetails.otherRequirements || 'None'}
Job Description:
${jobDetails.description.slice(0, 4000)}

--- CANDIDATE RESUME TEXT ---
${rawResumeText.slice(0, 5000)}
`;

    const aiResult = await generateJSON(prompt);
    if (aiResult && typeof aiResult.matchScore === 'number' && aiResult.scoreBreakdown) {
      return {
        ...aiResult,
        jobSnapshot: fallback.jobSnapshot,
        resumeSnapshot: fallback.resumeSnapshot,
      };
    }
  } catch (err) {
    console.warn('Gemini analysis failed or timed out; falling back to deterministic engine:', err);
  }

  return fallback;
}
