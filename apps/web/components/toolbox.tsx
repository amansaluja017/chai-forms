"use client";

import { useDraggable } from "@dnd-kit/core";
import { IconForms, IconTypography, IconNumber123, IconMail, IconPhone, IconMapPin, IconCheckbox, IconCircleDot, IconUpload, IconToggleLeft, IconCalendar, IconClock } from "@tabler/icons-react";

const FIELD_TYPES = [
  { type: "text", label: "Text Field", icon: IconTypography },
  { type: "number", label: "Number", icon: IconNumber123 },
  { type: "email", label: "Email", icon: IconMail },
  { type: "phone", label: "Phone", icon: IconPhone },
  { type: "address", label: "Address", icon: IconMapPin },
  { type: "checkbox", label: "Checkbox", icon: IconCheckbox },
  { type: "radio", label: "Radio", icon: IconCircleDot },
  { type: "file", label: "File Upload", icon: IconUpload },
  { type: "yes_no", label: "Yes/No", icon: IconToggleLeft },
  { type: "date", label: "Date", icon: IconCalendar },
  { type: "time", label: "Time", icon: IconClock },
  { type: "dropdown", label: "Dropdown", icon: IconForms },
];

function DraggableTool({ type, label, icon: Icon }: { type: string, label: string, icon: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tool-${type}`,
    data: {
      type: "ToolboxItem",
      fieldType: type,
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-background/40 hover:bg-primary/5 hover:border-primary/20 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 cursor-grab active:cursor-grabbing transition-all duration-300 ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary/80 group-hover:text-primary group-hover:bg-primary/20 transition-colors">
        <Icon className="size-5" />
      </div>
      <span className="text-sm font-medium tracking-tight">{label}</span>
    </div>
  );
}

export function Toolbox() {
  return (
    <div className="w-full border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col h-full overflow-y-auto rounded-2xl shadow-xl dark:bg-black/40">
      <div className="p-5 border-b border-white/10">
        <h3 className="font-bold tracking-tight">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag fields to the canvas</p>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {FIELD_TYPES.map((field) => (
          <DraggableTool key={field.type} type={field.type} label={field.label} icon={field.icon} />
        ))}
      </div>
    </div>
  );
}
