import { ResumeData, ATSScore } from './types';

export function calculateATSScore(data: ResumeData): ATSScore {
  const suggestions: string[] = [];
  let contactScore = 0;
  let summaryScore = 0;
  let experienceScore = 0;
  let educationScore = 0;
  let skillsScore = 0;
  let formatScore = 0;

  // Contact (max 20)
  const { contact } = data;
  if (contact.name) contactScore += 5;
  if (contact.email) contactScore += 5;
  if (contact.phone) contactScore += 4;
  if (contact.location) contactScore += 3;
  if (contact.linkedin) contactScore += 2;
  if (!contact.name) suggestions.push('Add your full name');
  if (!contact.email) suggestions.push('Add a professional email address');
  if (!contact.phone) suggestions.push('Add a phone number');
  if (!contact.linkedin) suggestions.push('Add your LinkedIn profile');

  // Summary (max 15)
  if (data.summary.length > 50) summaryScore += 8;
  if (data.summary.length > 150) summaryScore += 4;
  if (data.summary.length > 300) summaryScore += 3;
  if (!data.summary) suggestions.push('Add a professional summary (3–5 sentences recommended)');
  else if (data.summary.length < 100) suggestions.push('Expand your summary to 3–5 sentences');

  // Experience (max 30)
  if (data.experience.length === 0) {
    suggestions.push('Add at least one work experience entry');
  } else {
    experienceScore += Math.min(data.experience.length * 5, 15);
    const avgBullets = data.experience.reduce((s, e) => s + e.bullets.filter(Boolean).length, 0) / data.experience.length;
    if (avgBullets >= 3) experienceScore += 10;
    else if (avgBullets >= 2) experienceScore += 6;
    else experienceScore += 2;

    const hasMetrics = data.experience.some((e) =>
      e.bullets.some((b) => /\d+/.test(b))
    );
    if (hasMetrics) experienceScore += 5;
    else suggestions.push('Add quantified achievements (numbers, percentages, dollar amounts)');

    const allHaveDates = data.experience.every((e) => e.startDate);
    if (!allHaveDates) suggestions.push('Add start/end dates to all experience entries');
  }

  // Education (max 15)
  if (data.education.length === 0) {
    suggestions.push('Add your education history');
  } else {
    educationScore += 10;
    const hasDetails = data.education.some((e) => e.degree && e.institution);
    if (hasDetails) educationScore += 5;
    else suggestions.push('Add degree type and institution name to education entries');
  }

  // Skills (max 15)
  const allSkills = data.skillCategories.flatMap((c) => c.skills);
  if (allSkills.length === 0) {
    suggestions.push('Add your technical and professional skills');
  } else if (allSkills.length < 5) {
    skillsScore += 5;
    suggestions.push('Add more skills (aim for 10–20 relevant skills)');
  } else if (allSkills.length < 10) {
    skillsScore += 10;
  } else {
    skillsScore += 15;
  }

  // Format / completeness (max 5)
  let filledSections = 0;
  if (data.experience.length > 0) filledSections++;
  if (data.education.length > 0) filledSections++;
  if (allSkills.length >= 5) filledSections++;
  if (data.summary.length > 100) filledSections++;
  if (data.certifications.length > 0 || data.projects.length > 0) filledSections++;
  formatScore = filledSections;

  const total = contactScore + summaryScore + experienceScore + educationScore + skillsScore + formatScore;

  return {
    total: Math.min(total, 100),
    breakdown: {
      contact: Math.min(contactScore, 20),
      summary: Math.min(summaryScore, 15),
      experience: Math.min(experienceScore, 30),
      education: Math.min(educationScore, 15),
      skills: Math.min(skillsScore, 15),
      format: Math.min(formatScore, 5),
    },
    suggestions: suggestions.slice(0, 5),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#15803d';
  if (score >= 60) return '#d97706';
  return '#dc2626';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}
