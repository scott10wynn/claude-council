'use client';

import { useResumeStore } from '@/lib/store';
import { SectionId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection({ id, label, enabled }: { id: SectionId; label: string; enabled: boolean }) {
  const { toggleSection } = useResumeStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-2 rounded-lg border p-2 bg-white transition-shadow',
        isDragging && 'shadow-lg z-50 opacity-90',
        enabled ? 'border-gray-200' : 'border-dashed border-gray-200 opacity-50'
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-xs font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className={cn(
          'relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform',
            enabled ? 'translate-x-3' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}

export function SectionManager() {
  const { settings, reorderSections } = useResumeStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const from = settings.sections.findIndex((s) => s.id === active.id);
      const to = settings.sections.findIndex((s) => s.id === over.id);
      reorderSections(from, to);
    }
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-2">Drag to reorder · Toggle to show/hide</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={settings.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {settings.sections.map((sec) => (
              <SortableSection key={sec.id} id={sec.id} label={sec.label} enabled={sec.enabled} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
