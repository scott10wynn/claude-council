import { TemplateProps, FONT_SIZES, formatDate } from './shared';

export function ModernTemplate({ data, theme, enabledSections, fontSize }: TemplateProps) {
  const fs = FONT_SIZES[fontSize];
  const { contact, summary, experience, education, skillCategories, projects, certifications, languages } = data;

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: fs.base, color: '#1a1a1a', display: 'flex', minHeight: '100%' }}>
      {/* Left Sidebar */}
      <div style={{ width: '32%', backgroundColor: theme.primary, color: '#fff', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
        {/* Name + Title */}
        <div>
          <div style={{ fontSize: fs.name, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: '4px', wordBreak: 'break-word' }}>
            {contact.name || 'Your Name'}
          </div>
          {contact.title && (
            <div style={{ fontSize: fs.section, opacity: 0.85, fontStyle: 'italic', lineHeight: 1.3 }}>
              {contact.title}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: fs.section, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px' }}>
            Contact
          </div>
          {[
            { icon: '✉', value: contact.email },
            { icon: '📞', value: contact.phone },
            { icon: '📍', value: contact.location },
            { icon: '🌐', value: contact.website },
            { icon: 'in', value: contact.linkedin },
            { icon: '⌥', value: contact.github },
          ].filter((item) => item.value).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: fs.body, lineHeight: 1.4, wordBreak: 'break-all' }}>
              <span style={{ opacity: 0.7, fontSize: '9px', marginTop: '1px', minWidth: '12px' }}>{item.icon}</span>
              <span style={{ opacity: 0.9 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Skills */}
        {enabledSections.includes('skills') && skillCategories.length > 0 && (
          <div>
            <div style={{ fontSize: fs.section, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px' }}>
              Skills
            </div>
            {skillCategories.map((cat) => (
              <div key={cat.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: fs.section, fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {cat.skills.map((skill) => (
                    <span key={skill} style={{
                      fontSize: '9px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '3px',
                      padding: '1px 5px',
                      lineHeight: 1.6
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {enabledSections.includes('languages') && languages.length > 0 && (
          <div>
            <div style={{ fontSize: fs.section, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px' }}>
              Languages
            </div>
            {languages.map((lang) => (
              <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: fs.body }}>
                <span>{lang.name}</span>
                <span style={{ opacity: 0.7, fontSize: '9px', fontStyle: 'italic' }}>{lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content */}
      <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '18px', overflow: 'hidden' }}>
        {enabledSections.includes('summary') && summary && (
          <div>
            <SectionHeader label="Professional Summary" color={theme.primary} />
            <p style={{ fontSize: fs.body, lineHeight: 1.65, color: '#374151', marginTop: '6px' }}>{summary}</p>
          </div>
        )}

        {enabledSections.includes('experience') && experience.length > 0 && (
          <div>
            <SectionHeader label="Experience" color={theme.primary} />
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111827' }}>{exp.position}</div>
                      <div style={{ fontSize: fs.section, color: theme.primary, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <div style={{ fontSize: '9px', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px', marginTop: '1px' }}>
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ marginTop: '5px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: '#374151', lineHeight: 1.55, listStyleType: 'disc' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.includes('education') && education.length > 0 && (
          <div>
            <SectionHeader label="Education" color={theme.primary} />
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map((edu) => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: fs.body, fontWeight: 700, color: '#111827' }}>{edu.institution}</div>
                      <div style={{ fontSize: fs.section, color: '#6b7280' }}>
                        {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                        {edu.honors ? ` · ${edu.honors}` : ''}
                        {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.includes('projects') && projects.length > 0 && (
          <div>
            <SectionHeader label="Projects" color={theme.primary} />
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: fs.body, fontWeight: 700, color: '#111827' }}>{proj.name}</span>
                    {proj.technologies.length > 0 && (
                      <span style={{ fontSize: '9px', color: theme.primary, fontStyle: 'italic' }}>
                        {proj.technologies.join(' · ')}
                      </span>
                    )}
                  </div>
                  {proj.description && <p style={{ fontSize: fs.section, color: '#6b7280', marginTop: '2px' }}>{proj.description}</p>}
                  {proj.bullets.filter(Boolean).length > 0 && (
                    <ul style={{ marginTop: '4px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {proj.bullets.filter(Boolean).map((b, i) => (
                        <li key={i} style={{ fontSize: fs.body, color: '#374151', lineHeight: 1.55, listStyleType: 'disc' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {enabledSections.includes('certifications') && certifications.length > 0 && (
          <div>
            <SectionHeader label="Certifications" color={theme.primary} />
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {certifications.map((cert) => (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: fs.body, fontWeight: 600, color: '#111827' }}>{cert.name}</span>
                    <span style={{ fontSize: '9px', color: '#6b7280', marginLeft: '6px' }}>{cert.issuer}</span>
                  </div>
                  <span style={{ fontSize: '9px', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {formatDate(cert.date)}{cert.expiry ? ` – ${formatDate(cert.expiry)}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color }}>{label}</span>
      <div style={{ flex: 1, height: '1.5px', backgroundColor: color, opacity: 0.3 }} />
    </div>
  );
}
