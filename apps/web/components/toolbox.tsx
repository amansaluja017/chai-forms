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
      className={`flex items-center gap-3 p-3 rounded-md border bg-card/50 hover:bg-accent/50 cursor-grab active:cursor-grabbing transition-colors ${isDragging ? "opacity-50" : ""}`}
    >
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function Toolbox() {
  return (
    <div className="w-64 border-r bg-background/50 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold">Add Content</h3>
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
