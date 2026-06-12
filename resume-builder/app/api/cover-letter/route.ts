import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/lib/types';

export interface GenerateRequest {
  resumeData: ResumeData;
  jobDetails: {
    company: string;
    title: string;
    description: string;
    hiringManager?: string;
    companySize?: string;
  };
  options: {
    tone: 'professional' | 'enthusiastic' | 'creative' | 'conservative';
    length: 'concise' | 'standard' | 'detailed';
    format: 'standard' | 'achievement' | 'story' | 'problem-solution' | 'modern';
    experienceLevel: 'entry' | 'mid' | 'senior' | 'executive' | 'career-change';
    focus: string[];
    industry: string;
    closingStyle: 'warm' | 'confident' | 'bold';
  };
}

// ─── Guides ──────────────────────────────────────────────────────────────────

const LENGTH_GUIDE: Record<string, string> = {
  concise: '200–250 words (3 tight paragraphs)',
  standard: '300–380 words (4 paragraphs)',
  detailed: '420–500 words (4–5 paragraphs)',
};

const TONE_GUIDE: Record<string, string> = {
  professional: 'Polished and authoritative — formal but warm, confident without being boastful.',
  enthusiastic: 'Energetic and passionate — shows genuine excitement for the role while staying crisp and professional.',
  creative: 'Distinctive voice, slightly unconventional — leads with a compelling story or insight, shows personality.',
  conservative: 'Traditional formal business style — reserved, fact-focused, precise language throughout.',
};

const FORMAT_GUIDE: Record<string, string> = {
  standard: `STRUCTURE (Standard):
• Para 1 – Hook: Open with a specific achievement or value statement that immediately establishes fit. NOT your job title, NOT "I am applying."
• Para 2 – Evidence: Deep-dive into 1–2 of the most relevant experiences. Use specific metrics and outcomes from the resume.
• Para 3 – Why Them: Show genuine understanding of what this company is building and why this role matters to their mission. Be specific.
• Para 4 – Close: Confident call to action that invites a conversation.`,

  achievement: `STRUCTURE (Achievement-First):
• Para 1 – Lead with the single most impressive, relevant achievement. Open with the result, then brief context. No warmup.
• Para 2 – Second proof point that addresses a different key requirement from the job description.
• Para 3 – Why this company, why this role, why now. Specific, not generic.
• Para 4 – Close: Confident, specific call to action.`,

  story: `STRUCTURE (Story-Led):
• Para 1 – Story Hook: Open with a vivid 2–3 sentence story — a moment, a challenge, a realization — that reveals how you work and connects directly to this role.
• Para 2 – Connect & Prove: Bridge the story to your professional track record. Bring in 1–2 specific achievements with metrics.
• Para 3 – Why Them: Why this company's mission resonates and why this role fits your trajectory. Specific, not generic.
• Para 4 – Close: Warm but confident call to action.`,

  'problem-solution': `STRUCTURE (Problem-Solution):
• Para 1 – The Problem: Name a specific challenge this company or industry faces. Show you understand their world — this demonstrates research and business acumen.
• Para 2 – Your Solution: Pivot immediately to how your specific background addresses that exact challenge. Lead with the most relevant achievement.
• Para 3 – Evidence: A second proof point and why you're uniquely suited to this team.
• Para 4 – Close: Confident CTA framed around the value you'd bring.`,

  modern: `STRUCTURE (Modern/Direct — no salutation, start immediately with Para 1):
• Para 1 – Instant Hook: Start mid-thought, like a conversation already in progress. Drop the reader into your value. Punchy, contemporary.
• Para 2 – Achievement Evidence: 1–2 specific wins with metrics that prove you can do this job.
• Para 3 – Company Fit: Brief, sharp statement about why this company specifically.
• Para 4 – Close: Crisp, direct call to action.`,
};

const EXPERIENCE_GUIDE: Record<string, string> = {
  entry: 'Entry-level candidate: Draw on internships, academic projects, coursework, extracurriculars, and transferable skills. Emphasize learning velocity, fresh perspective, and specific project outcomes over tenure. Do NOT apologize for limited experience — lead with what exists.',
  mid: 'Mid-level candidate (3–8 years): Balance track record of delivery with clear growth trajectory. Show the candidate has moved beyond executing tasks to owning outcomes and influencing the team.',
  senior: 'Senior/Lead candidate: Lead with strategic impact, not job duties. Show initiatives driven, direction influenced, and measurable change delivered at the team or org level. Subordinate technical details to business outcomes.',
  executive: 'Executive candidate: Frame everything at the strategic/organizational level. P&L impact, org transformation, building functions, setting direction. Every achievement must show scale and consequence.',
  'career-change': 'Career changer: Actively bridge transferable skills to the new field. Reframe past experiences through the lens of what this role needs. Acknowledge the transition briefly and positively — then immediately demonstrate why the background is actually an advantage.',
};

const FOCUS_GUIDE: Record<string, string> = {
  technical: 'EMPHASIS — Technical Depth: Name specific tools, stacks, and methodologies. Show depth, not just breadth.',
  leadership: 'EMPHASIS — Leadership: Highlight leading people, projects, and initiatives. Show ownership and influence, even without a formal title.',
  impact: 'EMPHASIS — Quantified Impact: Every key point must include a number, percentage, dollar amount, or time metric. If it is in the resume, use it.',
  culture: 'EMPHASIS — Culture & Mission Fit: Explicitly connect the candidate\'s values to the company\'s mission or culture signals visible in the job description.',
  growth: 'EMPHASIS — Growth Trajectory: Show how the candidate has grown, adapted, and leveled up rapidly. Ideal for showcasing a steep improvement curve.',
  client: 'EMPHASIS — Client/Customer Focus: Highlight relationship-building, customer success, client-facing wins, and translating complex work into stakeholder value.',
};

const INDUSTRY_GUIDE: Record<string, string> = {
  tech: 'Industry context: Tech/Software. Use technical terminology naturally. Reference engineering culture, product thinking, and scale.',
  finance: 'Industry context: Finance/Banking. Emphasize precision, risk management, regulatory awareness, and quantified outcomes.',
  healthcare: 'Industry context: Healthcare. Reference patient outcomes, compliance, interdisciplinary collaboration, and mission-driven care.',
  marketing: 'Industry context: Marketing/Creative. Show brand awareness, audience understanding, creative judgment, and campaign results.',
  consulting: 'Industry context: Consulting. Frame everything as client problems solved, frameworks applied, and measurable value delivered.',
  startup: 'Industry context: Startup. Emphasize bias for action, wearing multiple hats, moving fast, building from scratch, and comfort with ambiguity.',
  corporate: 'Industry context: Enterprise/Corporate. Emphasize cross-functional alignment, process improvement, stakeholder management, and scalable execution.',
  nonprofit: 'Industry context: Nonprofit/Government. Lead with mission alignment. Emphasize community impact, resource efficiency, and stakeholder relationships.',
  general: '',
};

const CLOSING_GUIDE: Record<string, string> = {
  warm: 'Close warmly: express genuine interest in a conversation, be inviting and gracious.',
  confident: 'Close confidently: state you will follow up, note your availability, make it easy for them to say yes.',
  bold: 'Close boldly with a single memorable sentence that shows you are ready to start and means business.',
};

const BANNED_PHRASES = `
BANNED — never write any of the following (or obvious variations):
• "I am writing to apply"
• "I am excited to apply" / "I am thrilled to apply"
• "I am reaching out" / "I am contacting you"
• "I am a passionate [anything]"
• "I am a hardworking"
• "I am a team player" / "team-oriented"
• "I have always been passionate about"
• "With great enthusiasm"
• "I would be a great fit" / "I believe I am the perfect candidate"
• "Please find my resume attached" / "enclosed please find"
• "Thank you for your time and consideration"
• "I look forward to hearing from you at your earliest convenience"
• "Do not hesitate to contact me"
• "I am confident I would make a valuable addition"
• "My name is [name] and I am applying for"
• "I came across this role and"
• "I have a strong background in"
• "Proven track record" (use specifics instead)
• "Results-driven" / "detail-oriented" / "motivated self-starter"
• "Synergy" / "leverage" / "circle back" / "bandwidth" (corporate filler)
`.trim();

// ─── Resume serializer ────────────────────────────────────────────────────────

function serializeResume(data: ResumeData): string {
  const lines: string[] = [];
  const c = data.contact;

  lines.push(`NAME: ${c.name}${c.title ? ` | ${c.title}` : ''}`);
  lines.push(`CONTACT: ${c.email}${c.phone ? ` | ${c.phone}` : ''}${c.location ? ` | ${c.location}` : ''}`);
  if (c.linkedin) lines.push(`LinkedIn: ${c.linkedin}`);
  if (c.github) lines.push(`GitHub: ${c.github}`);
  if (c.website) lines.push(`Website: ${c.website}`);

  if (data.summary) {
    lines.push('', 'PROFESSIONAL SUMMARY:', data.summary);
  }

  if (data.experience.length > 0) {
    lines.push('', 'WORK EXPERIENCE:');
    for (const exp of data.experience) {
      lines.push(`\n${exp.position} @ ${exp.company}${exp.location ? ` (${exp.location})` : ''}`);
      lines.push(`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`);
      for (const b of exp.bullets) {
        if (b.trim()) lines.push(`• ${b}`);
      }
    }
  }

  if (data.education.length > 0) {
    lines.push('', 'EDUCATION:');
    for (const edu of data.education) {
      lines.push(
        `${edu.degree}${edu.field ? ` in ${edu.field}` : ''} — ${edu.institution}${edu.location ? ` (${edu.location})` : ''}`
      );
      lines.push(
        `${edu.startDate} – ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}${edu.honors ? ` | ${edu.honors}` : ''}`
      );
    }
  }

  if (data.skillCategories.length > 0) {
    lines.push('', 'SKILLS:');
    for (const cat of data.skillCategories) {
      if (cat.skills.length > 0) lines.push(`${cat.name}: ${cat.skills.join(', ')}`);
    }
  }

  if (data.projects.length > 0) {
    lines.push('', 'PROJECTS:');
    for (const proj of data.projects) {
      lines.push(`\n${proj.name}${proj.technologies.length > 0 ? ` [${proj.technologies.join(', ')}]` : ''}`);
      if (proj.description) lines.push(proj.description);
      for (const b of proj.bullets) {
        if (b.trim()) lines.push(`• ${b}`);
      }
    }
  }

  if (data.certifications.length > 0) {
    lines.push('', 'CERTIFICATIONS:');
    for (const cert of data.certifications) {
      lines.push(`${cert.name} — ${cert.issuer} (${cert.date})`);
    }
  }

  return lines.join('\n');
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(req: GenerateRequest): string {
  const { resumeData, jobDetails, options } = req;
  const { tone, length, format, experienceLevel, focus, industry, closingStyle } = options;

  const salutation =
    format === 'modern'
      ? ''
      : jobDetails.hiringManager
      ? `Dear ${jobDetails.hiringManager},`
      : 'Dear Hiring Manager,';

  const focusLines =
    focus.length > 0
      ? focus
          .filter((f) => FOCUS_GUIDE[f])
          .map((f) => FOCUS_GUIDE[f])
          .join('\n')
      : '';

  const industryLine = INDUSTRY_GUIDE[industry] ?? '';

  const companySizeLine = jobDetails.companySize
    ? `Company size/stage: ${jobDetails.companySize}`
    : '';

  return `You are one of the world's best cover letter writers. Every letter you produce wins interviews because it is ruthlessly specific, authentically human, and laser-targeted to the exact role and company. You never write templates.

═══════════════════════════════════════════════
CANDIDATE RESUME
═══════════════════════════════════════════════
${serializeResume(resumeData)}

═══════════════════════════════════════════════
TARGET ROLE
═══════════════════════════════════════════════
Company: ${jobDetails.company}
Position: ${jobDetails.title}
${jobDetails.hiringManager ? `Hiring Manager: ${jobDetails.hiringManager}` : ''}
${companySizeLine}

JOB DESCRIPTION:
${jobDetails.description}

═══════════════════════════════════════════════
BEFORE YOU WRITE — SILENT ANALYSIS (do not output this)
═══════════════════════════════════════════════
1. Identify the top 3 hard requirements from the job description.
2. Find the 2–3 resume achievements that most directly prove the candidate meets those requirements. Note any specific metrics.
3. Identify 1–2 things specific to this company (from the description) that the candidate should reference.
4. Extract the 6–10 most important keywords/skills from the JD that must appear naturally in the letter.

═══════════════════════════════════════════════
WRITING PARAMETERS
═══════════════════════════════════════════════
${FORMAT_GUIDE[format] ?? FORMAT_GUIDE['standard']}

Tone: ${TONE_GUIDE[tone]}
Length: ${LENGTH_GUIDE[length]}
${EXPERIENCE_GUIDE[experienceLevel]}
${focusLines}
${industryLine}
Closing style: ${CLOSING_GUIDE[closingStyle]}
${salutation ? `Opening salutation: Use "${salutation}" exactly.` : 'NO salutation — start directly with paragraph 1.'}

═══════════════════════════════════════════════
${BANNED_PHRASES}
═══════════════════════════════════════════════

ADDITIONAL QUALITY RULES:
• Every sentence must earn its place — cut anything vague or filler.
• Use the candidate's actual name, company names, and specific details from the resume.
• Weave the most important JD keywords in naturally — not in a list, not forced.
• Do NOT invent facts, metrics, or achievements not present in the resume.
• The letter must feel like a real person wrote it for this one specific job.
• Paragraphs should flow — vary sentence length, avoid starting consecutive sentences with "I".

OUTPUT: Only the cover letter text. No subject line, no commentary, no markdown. ${salutation ? 'Start with the salutation.' : 'Start directly with the first paragraph.'}`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const { jobDetails } = body;

    if (!jobDetails.company || !jobDetails.title || !jobDetails.description) {
      return NextResponse.json(
        { error: 'Company, title, and description are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(body);

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: 502 });
    }

    const result = await anthropicRes.json();
    const text: string = result.content?.[0]?.text ?? '';

    return NextResponse.json({ letter: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
