'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import { useState, useRef, KeyboardEvent } from 'react';

function SkillTag({ skill, onRemove }: { skill: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-800">
      {skill}
      <button type="button" onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}

function SkillCategoryEditor({ categoryId }: { categoryId: string }) {
  const { data, updateSkillCategory, removeSkillCategory } = useResumeStore();
  const category = data.skillCategories.find((c) => c.id === categoryId)!;
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function addSkill(value: string) {
    const trimmed = value.trim();
    if (trimmed && !category.skills.includes(trimmed)) {
      updateSkillCategory(categoryId, 'skills', [...category.skills, trimmed]);
    }
    setInput('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
    } else if (e.key === 'Backspace' && !input && category.skills.length > 0) {
      updateSkillCategory(categoryId, 'skills', category.skills.slice(0, -1));
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 text-sm font-medium text-gray-800 bg-transparent border-none outline-none focus:ring-0"
          value={category.name}
          placeholder="Category Name"
          onChange={(e) => updateSkillCategory(categoryId, 'name', e.target.value)}
        />
        <Button variant="ghost" size="icon" onClick={() => removeSkillCategory(categoryId)} className="text-red-400 hover:text-red-600 shrink-0">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div
        className="flex flex-wrap gap-1.5 min-h-[36px] cursor-text rounded-md border border-gray-200 p-2"
        onClick={() => inputRef.current?.focus()}
      >
        {category.skills.map((skill) => (
          <SkillTag
            key={skill}
            skill={skill}
            onRemove={() => updateSkillCategory(categoryId, 'skills', category.skills.filter((s) => s !== skill))}
          />
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && addSkill(input)}
          placeholder={category.skills.length === 0 ? 'Type skill, press Enter…' : ''}
          className="flex-1 min-w-[120px] text-xs bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400">Press Enter or comma to add · Backspace to remove last</p>
    </div>
  );
}

export function SkillsSection() {
  const { data, addSkillCategory } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.skillCategories.map((cat) => (
        <SkillCategoryEditor key={cat.id} categoryId={cat.id} />
      ))}
      <Button variant="outline" size="sm" onClick={addSkillCategory} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Skill Category
      </Button>
    </div>
  );
}
