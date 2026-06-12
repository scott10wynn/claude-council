import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '@/lib/types';

interface GenerateRequest {
  resumeData: ResumeData;
  jobDetails: {
    company: string;
    title: string;
    description: string;
    hiringManager?: string;
  };
  options: {
    tone: 'professional' | 'enthusiastic' | 'creative' | 'conservative';
    length: 'concise' | 'standard' | 'detailed';
  };
}

const LENGTH_GUIDE = {
  concise: '200–250 words (3 tight paragraphs)',
  standard: '300–380 words (4 paragraphs)',
  detailed: '420–500 words (4–5 paragraphs)',
};

const TONE_GUIDE = {
  professional: 'Polished and authoritative — formal but warm, confident without being boastful.',
  enthusiastic: 'Energetic and passionate — shows genuine excitement for the role while remaining crisp and professional.',
  creative: 'Slightly unconventional — leads with a compelling story or insight, shows distinct personality.',
  conservative: 'Traditional formal business style — reserved, fact-focused, precise language.',
};

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
      lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''} — ${edu.institution}${edu.location ? ` (${edu.location})` : ''}`);
      lines.push(`${edu.startDate} – ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}${edu.honors ? ` | ${edu.honors}` : ''}`);
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

function buildPrompt(req: GenerateRequest): string {
  const { resumeData, jobDetails, options } = req;
  const salutation = jobDetails.hiringManager
    ? `Dear ${jobDetails.hiringManager},`
    : 'Dear Hiring Manager,';

  return `You are an elite career coach and professional writer. Your cover letters land interviews at top companies because they are specific, human, and laser-targeted to each role — never generic.

CANDIDATE RESUME:
${serializeResume(resumeData)}

TARGET ROLE:
Company: ${jobDetails.company}
Position: ${jobDetails.title}
${jobDetails.hiringManager ? `Hiring Manager: ${jobDetails.hiringManager}` : ''}

JOB DESCRIPTION:
${jobDetails.description}

WRITING INSTRUCTIONS:

Tone: ${TONE_GUIDE[options.tone]}
Length: ${LENGTH_GUIDE[options.length]}
Opening salutation: Use "${salutation}" exactly.

Rules you must follow:
1. NEVER open with "I am writing to apply", "I am excited to apply", "I am reaching out", or any variation of these tired openers. Start the first paragraph with an immediate value statement, a specific achievement, or a compelling insight about the company's challenge.
2. Scan the job description for must-have requirements and key skills — weave those exact terms naturally into the letter.
3. Pick the 2–3 resume achievements most relevant to THIS specific role. Use the specific numbers and outcomes already in the resume; do not invent any.
4. Show genuine understanding of what the company does and why this role matters to their mission.
5. The letter must read like a real person wrote it for this one specific job — not a template.
6. Close with a confident, specific call to action (e.g., "I would welcome the chance to discuss how my background in X can help Y achieve Z").

Output only the cover letter text. No subject line, no preamble, no explanation. Start directly with the salutation.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const { jobDetails } = body;

    if (!jobDetails.company || !jobDetails.title || !jobDetails.description) {
      return NextResponse.json({ error: 'Company, title, and description are required.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 500 });
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
        max_tokens: 1024,
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
