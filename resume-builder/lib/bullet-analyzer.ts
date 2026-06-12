import { ACTION_VERBS, WEAK_PHRASES } from './keywords';

export interface BulletAnalysis {
  score: number; // 0-100
  grade: 'strong' | 'good' | 'weak' | 'poor';
  issues: string[];
  tips: string[];
  wordCount: number;
  hasMetric: boolean;
  hasActionVerb: boolean;
  hasWeakLanguage: boolean;
  startsWithActionVerb: boolean;
}

const ALL_ACTION_VERBS = new Set(
  Object.values(ACTION_VERBS).flat().map((v) => v.toLowerCase())
);

// Patterns that indicate quantified results
const METRIC_PATTERNS = [
  /\d+\s*%/,                          // percentages
  /\$\s*\d/,                          // dollar amounts
  /\d+[kKmMbB]/,                      // 1K, 2M, etc.
  /\d+\s*(x|times|fold)/i,            // multipliers
  /\d+\s*(hour|day|week|month|year)/i, // time savings
  /increased|decreased|reduced|improved|grew|cut|saved/i, // directional words
  /\d+\s*(people|team|member|report|client|customer|user)/i,
  /\bby\s+\d/i,                       // "by 40%"
  /\d+\s*(project|product|feature|version)/i,
];

export function analyzeBullet(text: string): BulletAnalysis {
  if (!text.trim()) {
    return { score: 0, grade: 'poor', issues: ['Empty bullet point'], tips: [], wordCount: 0, hasMetric: false, hasActionVerb: false, hasWeakLanguage: false, startsWithActionVerb: false };
  }

  const lower = text.toLowerCase().trim();
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;
  const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? '';

  let score = 0;
  const issues: string[] = [];
  const tips: string[] = [];

  // 1. Starts with action verb (+30)
  const startsWithActionVerb = ALL_ACTION_VERBS.has(firstWord);
  if (startsWithActionVerb) {
    score += 30;
  } else {
    issues.push('Does not start with an action verb');
    tips.push(`Start with a strong verb like "Led", "Built", "Reduced", "Achieved"`);
  }

  // 2. Contains a metric/number (+30)
  const hasMetric = METRIC_PATTERNS.some((p) => p.test(text));
  if (hasMetric) {
    score += 30;
  } else {
    issues.push('No quantified result or metric');
    tips.push('Add a number: % change, $ amount, team size, time saved, or scale');
  }

  // 3. No weak language (+20)
  const weakMatch = WEAK_PHRASES.find((wp) => lower.includes(wp.phrase));
  const hasWeakLanguage = !!weakMatch;
  if (!hasWeakLanguage) {
    score += 20;
  } else {
    issues.push(`Weak phrase: "${weakMatch!.phrase}"`);
    tips.push(weakMatch!.suggestion);
  }

  // 4. Ideal length 15-40 words (+10)
  const hasActionVerb = words.some((w) => ALL_ACTION_VERBS.has(w.toLowerCase().replace(/[^a-z]/g, '')));
  if (wordCount >= 12 && wordCount <= 45) {
    score += 10;
  } else if (wordCount < 12) {
    issues.push('Bullet is too short — add more context or results');
  } else {
    issues.push('Bullet is too long — consider splitting or trimming');
    tips.push('Aim for 15–40 words per bullet');
  }

  // 5. Shows impact/result — rough check for result clause (+10)
  const hasResult = /result(ing|ed)?|impact|achiev|improv|reduc|increas|decreas|enabl|allow|lead|led to|resulting in/.test(lower);
  if (hasResult || hasMetric) {
    score += 10;
  } else {
    tips.push('Show the outcome: "…resulting in X" or "…which improved Y by Z"');
  }

  const clampedScore = Math.min(score, 100);
  const grade = clampedScore >= 80 ? 'strong' : clampedScore >= 55 ? 'good' : clampedScore >= 30 ? 'weak' : 'poor';

  return { score: clampedScore, grade, issues, tips, wordCount, hasMetric, hasActionVerb, hasWeakLanguage, startsWithActionVerb };
}

export function getBulletGradeColor(grade: BulletAnalysis['grade']): string {
  return { strong: '#15803d', good: '#0369a1', weak: '#d97706', poor: '#dc2626' }[grade];
}

export function getBulletGradeLabel(grade: BulletAnalysis['grade']): string {
  return { strong: 'Strong', good: 'Good', weak: 'Weak', poor: 'Poor' }[grade];
}
