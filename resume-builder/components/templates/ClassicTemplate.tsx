import { TemplateProps, FONT_SIZES, formatDate } from './shared';

export function ClassicTemplate({ data, theme, enabledSections, fontSize }: TemplateProps) {
  const fs = FONT_SIZES[fontSize];
  const { contact, summary, experience, education, skillCategories, projects, certifications, languages } = data;

  return (
    <div style={{ fontFamily: 'Times New Roman, Georgia, serif', fontSize: fs.base, color: '#1a1a1a', padding: '36px 40px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: `3px double ${theme.primary}`, paddingBottom: '14px', marginBottom: '14px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#111', marginBottom: '3px' }}>
          {contact.name || 'Your Name'}
        </div>
        {contact.title && (
          <div style={{ fontSize: '11px', color: theme.primary, fontStyle: 'italic', marginBottom: '8px', letterSpacing: '0.5px' }}>
            {contact.title}
          </div>
        )}
        <div style={{ fontSize: '9.5px', color: '#555', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.website && <span>{contact.website}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>

      {enabledSections.includes('summary') && summary && (
        <Section label="OBJECTIVE / SUMMARY">
          <p style={{ fontSize: fs.body, lineHeight: 1.7, color: '#333', textAlign: 'justify' }}>{summary}</p>
        </Section>
      )}

      {enabledSections.includes('experience') && experience.length > 0 && (
        <Section label="PROFESSIONAL EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={exp.id} style={{ marginBottom: i < experience.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{exp.position}</span>
                  {exp.company && <span style={{ fontSize: fs.body, color: '#333' }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              {exp.location && <div style={{ fontSize: '9px', color: '#888', fontStyle: 'italic', marginBottom: '4px' }}>{exp.location}</div>}
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {exp.bullets.filter(Boolean).map((b, bi) => (
                    <li key={bi} style={{ fontSize: fs.body, color: '#333', lineHeight: 1.6, listStyleType: 'disc' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {enabledSections.includes('education') && education.length > 0 && (
        <Section label="EDUCATION">
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{edu.institution}</div>
                <div style={{ fontSize: '9.5px', color: '#555' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.honors && ` — ${edu.honors}`}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </div>
              </div>
              <div style={{ fontSize: '9px', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </div>
            </div>
          ))}
        </Section>
      )}

      {enabledSections.includes('skills') && skillCategories.length > 0 && (
        <Section label="SKILLS">
          {skillCategories.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'baseline' }}>
              <span style={{ fontSize: fs.body, fontWeight: 700, color: '#333', minWidth: '90px', whiteSpace: 'nowrap' }}>{cat.name}:</span>
              <span style={{ fontSize: fs.body, color: '#444', lineHeight: 1.6 }}>{cat.skills.join(', ')}</span>
            </div>
          ))}
        </Section>
      )}

      {enabledSections.includes('projects') && projects.length > 0 && (
        <Section label="PROJECTS">
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{proj.name}</span>
                {proj.technologies.length > 0 && (
                  <span style={{ fontSize: '9px', color: '#777', fontStyle: 'italic' }}>({proj.technologies.join(', ')})</span>
                )}
              </div>
              {proj.description && <p style={{ fontSize: '9.5px', color: '#555', margin: '2px 0', fontStyle: 'italic' }}>{proj.description}</p>}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '3px' }}>
                  {proj.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: '#333', lineHeight: 1.6, listStyleType: 'disc' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {enabledSections.includes('certifications') && certifications.length > 0 && (
        <Section label="CERTIFICATIONS">
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: fs.body, color: '#333' }}>
                <strong>{cert.name}</strong> — {cert.issuer}
              </span>
              <span style={{ fontSize: '9px', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </Section>
      )}

      {enabledSections.includes('languages') && languages.length > 0 && (
        <Section label="LANGUAGES">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: fs.body, color: '#333' }}>
                <strong>{lang.name}</strong> ({lang.proficiency})
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: '#111', borderBottom: '1px solid #999', paddingBottom: '3px', marginBottom: '8px' }}>
        {label}
      </div>
      {children}
    </div>
  );
}
