'use client';

import { ResumeData } from './types';
import { formatDate } from './utils';

export async function exportToDocx(data: ResumeData, enabledSections: string[]): Promise<void> {
  const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
    BorderStyle, convertInchesToTwip,
  } = await import('docx');

  const { contact, summary, experience, education, skillCategories, projects, certifications, languages } = data;

  const FONT = 'Calibri';
  const COLOR_PRIMARY = '1d4ed8';
  const COLOR_DARK = '111827';
  const COLOR_GRAY = '6b7280';

  function sectionHeader(text: string) {
    return new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1d4ed8', space: 4 } },
      run: { font: FONT, size: 22, bold: true, color: COLOR_PRIMARY },
    });
  }

  function bullet(text: string) {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 20, after: 20 },
      children: [new TextRun({ text, font: FONT, size: 20, color: COLOR_DARK })],
    });
  }

  function jobHeader(title: string, company: string, location: string, dates: string) {
    return new Paragraph({
      spacing: { before: 120, after: 20 },
      children: [
        new TextRun({ text: title, font: FONT, size: 21, bold: true, color: COLOR_DARK }),
        new TextRun({ text: `  |  ${company}${location ? `  ·  ${location}` : ''}`, font: FONT, size: 20, color: COLOR_PRIMARY }),
        new TextRun({ text: `  |  ${dates}`, font: FONT, size: 19, color: COLOR_GRAY }),
      ],
    });
  }

  const children: InstanceType<typeof Paragraph>[] = [];

  // ── Name & Contact ──
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: contact.name || 'Your Name', font: FONT, size: 40, bold: true, color: COLOR_DARK })],
    })
  );
  if (contact.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: contact.title, font: FONT, size: 22, italics: true, color: COLOR_PRIMARY })],
      })
    );
  }
  const contactLine = [contact.email, contact.phone, contact.location, contact.website, contact.linkedin, contact.github]
    .filter(Boolean)
    .join('  •  ');
  if (contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: contactLine, font: FONT, size: 19, color: COLOR_GRAY })],
      })
    );
  }

  // ── Summary ──
  if (enabledSections.includes('summary') && summary) {
    children.push(sectionHeader('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: summary, font: FONT, size: 20, color: COLOR_DARK })],
      })
    );
  }

  // ── Experience ──
  if (enabledSections.includes('experience') && experience.length > 0) {
    children.push(sectionHeader('Work Experience'));
    for (const exp of experience) {
      const dates = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      children.push(jobHeader(exp.position, exp.company, exp.location, dates));
      for (const b of exp.bullets.filter(Boolean)) {
        children.push(bullet(b));
      }
    }
  }

  // ── Education ──
  if (enabledSections.includes('education') && education.length > 0) {
    children.push(sectionHeader('Education'));
    for (const edu of education) {
      const degreeText = [edu.degree, edu.field].filter(Boolean).join(' in ');
      const meta = [edu.honors, edu.gpa ? `GPA: ${edu.gpa}` : ''].filter(Boolean).join(' · ');
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({ text: edu.institution, font: FONT, size: 21, bold: true, color: COLOR_DARK }),
            new TextRun({ text: `  —  ${edu.location}`, font: FONT, size: 20, color: COLOR_GRAY }),
            new TextRun({ text: `  |  ${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`, font: FONT, size: 19, color: COLOR_GRAY }),
          ],
        })
      );
      if (degreeText || meta) {
        children.push(
          new Paragraph({
            spacing: { after: 20 },
            children: [
              new TextRun({ text: degreeText, font: FONT, size: 20, italics: true, color: COLOR_PRIMARY }),
              meta ? new TextRun({ text: `  |  ${meta}`, font: FONT, size: 19, color: COLOR_GRAY }) : new TextRun({ text: '' }),
            ],
          })
        );
      }
    }
  }

  // ── Skills ──
  if (enabledSections.includes('skills') && skillCategories.length > 0) {
    children.push(sectionHeader('Skills'));
    for (const cat of skillCategories) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 40 },
          children: [
            new TextRun({ text: `${cat.name}: `, font: FONT, size: 20, bold: true, color: COLOR_DARK }),
            new TextRun({ text: cat.skills.join(', '), font: FONT, size: 20, color: COLOR_DARK }),
          ],
        })
      );
    }
  }

  // ── Projects ──
  if (enabledSections.includes('projects') && projects.length > 0) {
    children.push(sectionHeader('Projects'));
    for (const proj of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({ text: proj.name, font: FONT, size: 21, bold: true, color: COLOR_DARK }),
            proj.technologies.length > 0
              ? new TextRun({ text: `  (${proj.technologies.join(', ')})`, font: FONT, size: 19, italics: true, color: COLOR_GRAY })
              : new TextRun({ text: '' }),
          ],
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 20 },
            children: [new TextRun({ text: proj.description, font: FONT, size: 19, italics: true, color: COLOR_GRAY })],
          })
        );
      }
      for (const b of proj.bullets.filter(Boolean)) {
        children.push(bullet(b));
      }
    }
  }

  // ── Certifications ──
  if (enabledSections.includes('certifications') && certifications.length > 0) {
    children.push(sectionHeader('Certifications'));
    for (const cert of certifications) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({ text: cert.name, font: FONT, size: 20, bold: true, color: COLOR_DARK }),
            new TextRun({ text: `  —  ${cert.issuer}`, font: FONT, size: 19, color: COLOR_GRAY }),
            new TextRun({ text: `  |  ${formatDate(cert.date)}`, font: FONT, size: 19, color: COLOR_GRAY }),
          ],
        })
      );
    }
  }

  // ── Languages ──
  if (enabledSections.includes('languages') && languages.length > 0) {
    children.push(sectionHeader('Languages'));
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: languages.flatMap((l, i) => [
          new TextRun({ text: l.name, font: FONT, size: 20, bold: true }),
          new TextRun({ text: ` (${l.proficiency})`, font: FONT, size: 19, color: COLOR_GRAY }),
          i < languages.length - 1 ? new TextRun({ text: '  ·  ', font: FONT, size: 20 }) : new TextRun({ text: '' }),
        ]),
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.9),
            right: convertInchesToTwip(0.9),
          },
        },
      },
      children,
    }],
    styles: {
      paragraphStyles: [
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { font: FONT, size: 22, bold: true, color: COLOR_PRIMARY },
        },
      ],
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(data.contact.name || 'resume').replace(/\s+/g, '-')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
