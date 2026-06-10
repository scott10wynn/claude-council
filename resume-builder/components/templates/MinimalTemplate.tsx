import { TemplateProps, FONT_SIZES, formatDate } from './shared';

export function MinimalTemplate({ data, theme, enabledSections, fontSize }: TemplateProps) {
  const fs = FONT_SIZES[fontSize];
  const { contact, summary, experience, education, skillCategories, projects, certifications, languages } = data;

  return (
    <div style={{ fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', fontSize: fs.base, color: '#1a1a1a', padding: '40px 44px', background: '#fafafa' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', color: '#111', lineHeight: 1 }}>
          {contact.name || 'Your Name'}
        </div>
        {contact.title && (
          <div style={{ fontSize: '12px', color: theme.primary, fontWeight: 500, marginTop: '4px', letterSpacing: '0.3px' }}>
            {contact.title}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', marginTop: '10px' }}>
          {[contact.email, contact.phone, contact.location, contact.website, contact.linkedin, contact.github].filter(Boolean).map((val, i) => (
            <span key={i} style={{ fontSize: '9.5px', color: '#888', letterSpacing: '0.2px' }}>{val}</span>
          ))}
        </div>
        <div style={{ height: '2px', background: `linear-gradient(to right, ${theme.primary}, transparent)`, marginTop: '14px', borderRadius: '1px' }} />
      </div>

      {enabledSections.includes('summary') && summary && (
        <MinSection label="About" theme={theme}>
          <p style={{ fontSize: fs.body, lineHeight: 1.75, color: '#555', marginTop: '6px' }}>{summary}</p>
        </MinSection>
      )}

      {enabledSections.includes('experience') && experience.length > 0 && (
        <MinSection label="Experience" theme={theme}>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '1px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111', letterSpacing: '-0.2px' }}>{exp.position}</div>
                  <div style={{ fontSize: '9.5px', color: theme.primary, fontWeight: 500 }}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                  </div>
                </div>
                <div style={{ fontSize: '9px', color: '#bbb', whiteSpace: 'nowrap', marginLeft: '8px', letterSpacing: '0.5px' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Now' : formatDate(exp.endDate)}
                </div>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul style={{ marginTop: '5px', paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} style={{ fontSize: fs.body, color: '#444', lineHeight: 1.6, paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: theme.primary, fontWeight: 700 }}>›</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </MinSection>
      )}

      {enabledSections.includes('education') && education.length > 0 && (
        <MinSection label="Education" theme={theme}>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{edu.institution}</div>
                <div style={{ fontSize: '9.5px', color: '#777' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.honors && <span style={{ color: theme.primary }}> · {edu.honors}</span>}
                </div>
              </div>
              <div style={{ fontSize: '9px', color: '#bbb', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {formatDate(edu.endDate)}
              </div>
            </div>
          ))}
        </MinSection>
      )}

      {enabledSections.includes('skills') && skillCategories.length > 0 && (
        <MinSection label="Skills" theme={theme}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            {skillCategories.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#aaa', minWidth: '70px' }}>{cat.name}</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {cat.skills.map((skill) => (
                    <span key={skill} style={{ fontSize: '9.5px', color: '#555', padding: '1px 6px', background: '#efefef', borderRadius: '3px' }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MinSection>
      )}

      {enabledSections.includes('projects') && projects.length > 0 && (
        <MinSection label="Projects" theme={theme}>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: fs.body, fontWeight: 700, color: '#111' }}>{proj.name}</span>
                {proj.technologies.length > 0 && (
                  <span style={{ fontSize: '9px', color: '#aaa' }}>{proj.technologies.join(' · ')}</span>
                )}
              </div>
              {proj.description && <p style={{ fontSize: '9.5px', color: '#777', marginTop: '2px', fontStyle: 'italic' }}>{proj.description}</p>}
              {proj.bullets.filter(Boolean).map((b, i) => (
                <div key={i} style={{ fontSize: fs.body, color: '#444', paddingLeft: '12px', position: 'relative', lineHeight: 1.6, marginTop: '3px' }}>
                  <span style={{ position: 'absolute', left: 0, color: theme.primary, fontWeight: 700 }}>›</span>
                  {b}
                </div>
              ))}
            </div>
          ))}
        </MinSection>
      )}

      {enabledSections.includes('certifications') && certifications.length > 0 && (
        <MinSection label="Certifications" theme={theme}>
          {certifications.map((cert) => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ fontSize: fs.body, color: '#444' }}>
                <strong>{cert.name}</strong>
                <span style={{ color: '#aaa', marginLeft: '6px' }}>{cert.issuer}</span>
              </div>
              <span style={{ fontSize: '9px', color: '#bbb' }}>{formatDate(cert.date)}</span>
            </div>
          ))}
        </MinSection>
      )}

      {enabledSections.includes('languages') && languages.length > 0 && (
        <MinSection label="Languages" theme={theme}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {languages.map((lang) => (
              <span key={lang.id} style={{ fontSize: fs.body, color: '#555' }}>
                {lang.name} <span style={{ color: '#aaa', fontSize: '9px' }}>({lang.proficiency})</span>
              </span>
            ))}
          </div>
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ label, children, theme }: { label: string; children: React.ReactNode; theme: { primary: string } }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: theme.primary }}>{label}</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
      </div>
      {children}
    </div>
  );
}
