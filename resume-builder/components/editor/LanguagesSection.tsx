'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Language } from '@/lib/types';

const PROFICIENCY_LEVELS: Language['proficiency'][] = ['Native', 'Fluent', 'Proficient', 'Intermediate', 'Basic'];

export function LanguagesSection() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  return (
    <div className="space-y-2">
      {data.languages.map((lang) => (
        <div key={lang.id} className="flex items-end gap-2">
          <div className="flex-1">
            <Input label="Language" value={lang.name} placeholder="Spanish" onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-gray-600 block mb-1">Proficiency</label>
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
              className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROFICIENCY_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)} className="text-red-400 hover:text-red-600 mb-0.5">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addLanguage} className="w-full border-dashed mt-1">
        <Plus className="h-4 w-4" /> Add Language
      </Button>
    </div>
  );
}
