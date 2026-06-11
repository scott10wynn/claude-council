'use client';

import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react';
import { useState, KeyboardEvent, useRef } from 'react';

export function ProjectsSection() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();
  const [expanded, setExpanded] = useState<string | null>(data.projects[0]?.id ?? null);
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const techRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function addTech(projId: string, value: string) {
    const trimmed = value.trim();
    const proj = data.projects.find((p) => p.id === projId)!;
    if (trimmed && !proj.technologies.includes(trimmed)) {
      updateProject(projId, 'technologies', [...proj.technologies, trimmed]);
    }
    setTechInputs((s) => ({ ...s, [projId]: '' }));
  }

  function handleTechKey(e: KeyboardEvent<HTMLInputElement>, projId: string) {
    const val = techInputs[projId] ?? '';
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech(projId, val);
    }
  }

  return (
    <div className="space-y-3">
      {data.projects.map((proj) => (
        <div key={proj.id} className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
          >
            <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{proj.name || 'New Project'}</p>
              <p className="text-xs text-gray-500 truncate">{proj.technologies.join(', ') || 'No technologies'}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }} className="text-red-400 hover:text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              {expanded === proj.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {expanded === proj.id && (
            <div className="px-3 pb-3 space-y-2.5 border-t border-gray-200 bg-white pt-2.5">
              <Input label="Project Name" value={proj.name} placeholder="Awesome Project" onChange={(e) => updateProject(proj.id, 'name', e.target.value)} />
              <Textarea label="Short Description" value={proj.description} placeholder="A brief one-line description" rows={2} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Input label="Live URL (optional)" value={proj.url ?? ''} placeholder="https://project.io" onChange={(e) => updateProject(proj.id, 'url', e.target.value)} />
                <Input label="GitHub (optional)" value={proj.github ?? ''} placeholder="github.com/you/repo" onChange={(e) => updateProject(proj.id, 'github', e.target.value)} />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Technologies</label>
                <div className="flex flex-wrap gap-1.5 min-h-[36px] cursor-text rounded-md border border-gray-200 p-2" onClick={() => techRefs.current[proj.id]?.focus()}>
                  {proj.technologies.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-xs text-purple-800">
                      {t}
                      <button type="button" onClick={() => updateProject(proj.id, 'technologies', proj.technologies.filter((x) => x !== t))} className="hover:text-red-500">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={(el) => { techRefs.current[proj.id] = el; }}
                    value={techInputs[proj.id] ?? ''}
                    onChange={(e) => setTechInputs((s) => ({ ...s, [proj.id]: e.target.value }))}
                    onKeyDown={(e) => handleTechKey(e, proj.id)}
                    onBlur={() => (techInputs[proj.id] ?? '').trim() && addTech(proj.id, techInputs[proj.id] ?? '')}
                    placeholder="React, Node.js…"
                    className="flex-1 min-w-[100px] text-xs bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Highlights</label>
                {proj.bullets.map((b, bi) => (
                  <div key={bi} className="flex gap-1.5 mb-1.5">
                    <span className="mt-2 text-gray-400 text-sm">•</span>
                    <Textarea
                      value={b}
                      placeholder="What did you build/achieve?"
                      rows={2}
                      onChange={(e) => {
                        const arr = [...proj.bullets];
                        arr[bi] = e.target.value;
                        updateProject(proj.id, 'bullets', arr);
                      }}
                      className="flex-1 text-xs"
                    />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const arr = proj.bullets.filter((_, i) => i !== bi);
                      updateProject(proj.id, 'bullets', arr.length ? arr : ['']);
                    }} className="mt-1 text-red-400 hover:text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => updateProject(proj.id, 'bullets', [...proj.bullets, ''])}>
                  <Plus className="h-3.5 w-3.5" /> Add highlight
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addProject} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
