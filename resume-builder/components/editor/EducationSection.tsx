'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { useState } from 'react';

export function EducationSection() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [expanded, setExpanded] = useState<string | null>(data.education[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {data.education.map((edu) => (
        <div key={edu.id} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
          >
            <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {edu.institution || 'Institution Name'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                className="text-red-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              {expanded === edu.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {expanded === edu.id && (
            <div className="px-3 pb-3 space-y-2.5 border-t border-gray-200 bg-white pt-2.5">
              <Input label="Institution" value={edu.institution} placeholder="MIT / Stanford University" onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Degree" value={edu.degree} placeholder="Bachelor of Science" onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} />
                <Input label="Field of Study" value={edu.field} placeholder="Computer Science" onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} />
                <Input label="Location" value={edu.location} placeholder="Cambridge, MA" onChange={(e) => updateEducation(edu.id, 'location', e.target.value)} />
                <Input label="GPA (optional)" value={edu.gpa ?? ''} placeholder="3.8 / 4.0" onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} />
                <Input label="Start Date" type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} />
                <Input label="End Date" type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} />
                <div className="col-span-2">
                  <Input label="Honors / Achievements (optional)" value={edu.honors ?? ''} placeholder="Magna Cum Laude, Dean's List" onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addEducation} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
