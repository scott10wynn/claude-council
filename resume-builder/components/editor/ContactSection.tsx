'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';

export function ContactSection() {
  const { data, updateContact } = useResumeStore();
  const { contact } = data;

  const fields: { key: keyof typeof contact; label: string; placeholder: string; type?: string }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'Alex Johnson' },
    { key: 'title', label: 'Professional Title', placeholder: 'Senior Software Engineer' },
    { key: 'email', label: 'Email', placeholder: 'alex@example.com', type: 'email' },
    { key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
    { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
    { key: 'website', label: 'Website / Portfolio', placeholder: 'yoursite.dev' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((f) => (
        <div key={f.key} className={f.key === 'name' || f.key === 'title' ? 'col-span-2' : ''}>
          <Input
            label={f.label}
            type={f.type ?? 'text'}
            value={contact[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => updateContact(f.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
