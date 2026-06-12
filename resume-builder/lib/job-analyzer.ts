import { ATS_STOP_WORDS } from './keywords';
import { ResumeData } from './types';

export interface KeywordMatch {
  keyword: string;
  inResume: boolean;
  frequency: number; // how many times it appears in JD
  priority: 'high' | 'medium' | 'low';
}

export interface JobAnalysis {
  matchScore: number; // 0-100
  totalKeywords: number;
  matchedCount: number;
  missingHigh: string[];
  missingMedium: string[];
  matched: string[];
  allKeywords: KeywordMatch[];
}

// Extract meaningful tokens from text
function extractKeywords(text: string): Map<string, number> {
  const freq = new Map<string, number>();

  // Extract multi-word phrases first (2-3 grams)
  const phrasePatterns = [
    // Common tech/business phrases
    /\b(supply chain|data analysis|project management|customer service|team leader|account management|business development|financial analysis|strategic planning|process improvement|cross-functional|stakeholder management|budget management|risk management|quality assurance|machine learning|artificial intelligence|natural language|cloud computing|agile methodology|lean manufacturing|six sigma|product management|user experience|full stack|front.?end|back.?end|ci\/cd|devops|microsoft (excel|word|powerpoint|office)|google workspace)\b/gi,
  ];

  for (const pattern of phrasePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      freq.set(phrase, (freq.get(phrase) ?? 0) + 1);
    }
  }

  // Single words
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !ATS_STOP_WORDS.has(w));

  for (const word of words) {
    if (!freq.has(word)) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }

  return freq;
}

function getResumeText(data: ResumeData): string {
  const parts: string[] = [
    data.contact.title,
    data.summary,
    ...data.experience.flatMap((e) => [e.position, e.company, ...e.bullets]),
    ...data.education.flatMap((e) => [e.degree, e.field, e.institution]),
    ...data.skillCategories.flatMap((c) => [c.name, ...c.skills]),
    ...data.projects.flatMap((p) => [p.name, p.description, ...p.technologies, ...p.bullets]),
    ...data.certifications.map((c) => c.name),
  ];
  return parts.filter(Boolean).join(' ');
}

export function analyzeJobDescription(jobDescription: string, resumeData: ResumeData): JobAnalysis {
  if (!jobDescription.trim()) {
    return { matchScore: 0, totalKeywords: 0, matchedCount: 0, missingHigh: [], missingMedium: [], matched: [], allKeywords: [] };
  }

  const jdKeywords = extractKeywords(jobDescription);
  const resumeText = getResumeText(resumeData).toLowerCase();

  // Sort by frequency to determine priority
  const sorted = Array.from(jdKeywords.entries()).sort((a, b) => b[1] - a[1]);

  const allKeywords: KeywordMatch[] = [];
  const matched: string[] = [];
  const missingHigh: string[] = [];
  const missingMedium: string[] = [];

  // Take top 40 most relevant keywords from JD
  const topKeywords = sorted.slice(0, 40);
  const maxFreq = topKeywords[0]?.[1] ?? 1;

  for (const [keyword, freq] of topKeywords) {
    // Skip very common single-letter words and numbers
    if (keyword.length < 3) continue;

    const inResume = resumeText.includes(keyword);
    const priority: KeywordMatch['priority'] =
      freq >= maxFreq * 0.6 ? 'high' : freq >= maxFreq * 0.3 ? 'medium' : 'low';

    allKeywords.push({ keyword, inResume, frequency: freq, priority });

    if (inResume) {
      matched.push(keyword);
    } else if (priority === 'high') {
      missingHigh.push(keyword);
    } else if (priority === 'medium') {
      missingMedium.push(keyword);
    }
  }

  const totalKeywords = allKeywords.length;
  const matchedCount = matched.length;
  const matchScore = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;

  return {
    matchScore,
    totalKeywords,
    matchedCount,
    missingHigh: missingHigh.slice(0, 10),
    missingMedium: missingMedium.slice(0, 10),
    matched: matched.slice(0, 15),
    allKeywords,
  };
}

export function getMatchScoreColor(score: number): string {
  if (score >= 70) return '#15803d';
  if (score >= 45) return '#d97706';
  return '#dc2626';
}

export function getMatchScoreLabel(score: number): string {
  if (score >= 70) return 'Strong Match';
  if (score >= 45) return 'Partial Match';
  if (score >= 20) return 'Weak Match';
  return 'Low Match';
}
