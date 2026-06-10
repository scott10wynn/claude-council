import { TemplateProps, FONT_SIZES, formatDate } from './shared';

export function ExecutiveTemplate({ data, theme, enabledSections, fontSize }: TemplateProps) {
  const fs = FONT_SIZES[fontSize];
  const { contact, summary, experience, education, skillCategories, projects, certifications, languages } = data;

  return (
    <div style={{ fontFamily: 'Garamond, Georgia, serif', fontSize: fs.base, color: '#1a1a1a' }}>
      {/* Bold header band */}
      <div style={{ backgroundColor: theme.dark, padding: '28px 36px 20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1 }}>
          {contact.name || 'Your Name'}
        </div>
        {contact.title && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginTop: '5px', letterSpacing: '1px', textTransform: 'uppercase', fontStyle: 'italic' }}>
            {contact.title}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: '14px' }}>
          {[
            contact.email && `✉  ${contact.email}`,
            contact.phone && `☎  ${contact.phone}`,
            contact.location && `⌖  ${contact.location}`,
            contact.website && `⊕  ${contact.website}`,
            contact.linkedin && `in  ${contact.linkedin}`,
            contact.github && `⎇  ${contact.github}`,
          ].filter(Boolean).map((val, i) => (
            <span key={i} style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.3px' }}>{val}</span>
          ))}
        </div>
      </div>

      {/* Color stripe */}
      <div style={{ height: '4px', background: `linear-gradient(to right, ${theme.primary}, ${theme.light})` }} />

      {/* Body — two columns */}
      <div style={{ display: 'flex', gap: '0' }}>
        {/* Main column (65%) */}
        <div style={{ width: '65%', padding: '24px 24px 24px 32px', borderRight: `1px solid #e5e7eb` }}>
          {enabledSections.includes('summary') && summary && (
            <ExecSection label="Executive Summary" theme={theme}>
              <p style={{ fontSize: fs.body, lineHeight: 1.75, color: '#374151', fontStyle: 'italic', borderLeft: `3px solid ${theme.primary}`, paddingLeft: '10px' }}>{summary}</p>
            </ExecSection>
          )}

          {enabledSections.includes('experience') && experience.length > 0 && (
            <ExecSection label="Career History" theme={theme}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>{exp.position}</div>
                      <div style={{ fontSize: '10px', color: theme.primary, fontWeight: 600 }}>
                        {exp.company}
                        {exp.location && <span style={{ color: '#9ca3af', fontWeight: 400 }}> · {exp.location}</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '8px', fontStyle: 'italic' }}>
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ marginTop: '5px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: '#374151', lineHeight: 1.6, listStyleType: 'disc' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </ExecSection>
          )}

          {enabledSections.includes('projects') && projects.length > 0 && (
            <ExecSection label="Key Projects" theme={theme}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: fs.body, color: '#111' }}>
                    {proj.name}
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 400, marginLeft: '6px' }}>({proj.technologies.join(', ')})</span>
                    )}
                  </div>
                  {proj.description && <p style={{ fontSize: '9px', color: '#6b7280', fontStyle: 'italic', margin: '2px 0' }}>{proj.description}</p>}
                  {proj.bullets.filter(Boolean).map((b, i) => (
                    <div key={i} style={{ fontSize: fs.body, color: '#374151', paddingLeft: '14px', position: 'relative', lineHeight: 1.6, marginTop: '3px' }}>
                      <span style={{ position: 'absolute', left: 0 }}>•</span>
                      {b}
                    </div>
                  ))}
                </div>
              ))}
            </ExecSection>
          )}
        </div>

        {/* Side column (35%) */}
        <div style={{ width: '35%', padding: '24px 24px 24px 20px', backgroundColor: '#f9fafb' }}>
          {enabledSections.includes('education') && education.length > 0 && (
            <SideSection label="Education" theme={theme}>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{edu.institution}</div>
                  <div style={{ fontSize: '9.5px', color: '#6b7280' }}>
                    {[edu.degree, edu.field].filter(Boolean).join('\nin ')}
                  </div>
                  {edu.honors && <div style={{ fontSize: '9px', color: theme.primary, fontStyle: 'italic' }}>{edu.honors}</div>}
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                    {formatDate(edu.endDate)}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}
                  </div>
                </div>
              ))}
            </SideSection>
          )}

          {enabledSections.includes('skills') && skillCategories.length > 0 && (
            <SideSection label="Core Competencies" theme={theme}>
              {skillCategories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: theme.primary, marginBottom: '3px' }}>{cat.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                    {cat.skills.map((skill) => (
                      <span key={skill} style={{ fontSize: '9px', backgroundColor: theme.light, color: theme.dark, borderRadius: '2px', padding: '1px 5px', border: `1px solid ${theme.primary}30` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </SideSection>
          )}

          {enabledSections.includes('certifications') && certifications.length > 0 && (
            <SideSection label="Certifications" theme={theme}>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: fs.body, fontWeight: 600, color: '#111', lineHeight: 1.4 }}>{cert.name}</div>
                  <div style={{ fontSize: '9px', color: '#6b7280' }}>{cert.issuer}</div>
                  <div style={{ fontSize: '9px', color: '#9ca3af' }}>{formatDate(cert.date)}</div>
                </div>
              ))}
            </SideSection>
          )}

          {enabledSections.includes('languages') && languages.length > 0 && (
            <SideSection label="Languages" theme={theme}>
              {languages.map((lang) => (
                <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs.body, marginBottom: '3px' }}>
                  <span style={{ color: '#374151' }}>{lang.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: '9px', fontStyle: 'italic' }}>{lang.proficiency}</span>
                </div>
              ))}
            </SideSection>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecSection({ label, children, theme }: { label: string; children: React.ReactNode; theme: { primary: string } }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: theme.primary, borderBottom: `2px solid ${theme.primary}`, paddingBottom: '4px', marginBottom: '10px' }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function SideSection({ label, children, theme }: { label: string; children: React.ReactNode; theme: { primary: string } }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#111', borderBottom: `1px solid #d1d5db`, paddingBottom: '4px', marginBottom: '8px' }}>
        {label}
      </div>
      {children}
    </div>
  );
}
