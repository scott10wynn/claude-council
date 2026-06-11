'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function ExperienceSection() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();
  const [expanded, setExpanded] = useState<string | null>(data.experience[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {data.experience.map((exp, index) => (
        <div key={exp.id} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
          >
            <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {exp.position || 'New Position'}{exp.company ? ` @ ${exp.company}` : ''}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {exp.startDate || '—'} – {exp.current ? 'Present' : exp.endDate || '—'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              {expanded === exp.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {expanded === exp.id && (
            <div className="px-3 pb-3 space-y-2.5 border-t border-gray-200 bg-white">
              <div className="grid grid-cols-2 gap-2 pt-2.5">
                <Input label="Position / Title" value={exp.position} placeholder="Senior Engineer" onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} />
                <Input label="Company" value={exp.company} placeholder="Acme Corp" onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                <Input label="Location" value={exp.location} placeholder="Remote / New York" onChange={(e) => updateExperience(exp.id, 'location', e.target.value)} />
                <div className="flex items-end gap-1.5">
                  <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="flex-1" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Currently working here
                  </label>
                  {!exp.current && (
                    <Input label="" type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="w-40" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Bullet Points</label>
                <div className="space-y-1.5">
                  {exp.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-1.5">
                      <span className="mt-2 text-gray-400 text-sm">•</span>
                      <Textarea
                        value={bullet}
                        placeholder="Accomplished X by doing Y, resulting in Z..."
                        rows={2}
                        onChange={(e) => {
                          const newBullets = [...exp.bullets];
                          newBullets[bi] = e.target.value;
                          updateExperience(exp.id, 'bullets', newBullets);
                        }}
                        className="flex-1 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newBullets = exp.bullets.filter((_, i) => i !== bi);
                          updateExperience(exp.id, 'bullets', newBullets.length ? newBullets : ['']);
                        }}
                        className="mt-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1.5 text-blue-600 hover:text-blue-700"
                  onClick={() => updateExperience(exp.id, 'bullets', [...exp.bullets, ''])}
                >
                  <Plus className="h-3.5 w-3.5" /> Add bullet
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addExperience} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}
