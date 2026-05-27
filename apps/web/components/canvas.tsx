"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IconGripVertical } from "@tabler/icons-react";
import SortableField from "./sortable-feilds";
import { useFormBuilder } from "~/components/workspace/context";
import { AIPromptBar } from "./ai-prompt-bar";

export function Canvas() {
  const { fields, setSelectedFieldId } = useFormBuilder();
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
    data: {
      type: "Canvas",
    }
  });

  const fieldIds = fields.map((f) => f.id!);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <div
        className="flex-1 overflow-y-auto px-4 py-8 md:p-8 flex flex-col items-center"
        onClick={() => setSelectedFieldId(null)}
      >
        <div
          ref={setNodeRef}
          className={`w-full max-w-3xl min-h-[700px] shrink-0 mb-32 border border-white/10 rounded-2xl p-6 md:p-10 transition-all duration-500 shadow-2xl backdrop-blur-3xl
            ${isOver ? "border-primary bg-primary/5 ring-4 ring-primary/10 scale-[1.01]" : "bg-card/90"}
            ${fields.length === 0 ? "flex items-center justify-center flex-col text-muted-foreground" : "pb-12"}
          `}
        >
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center opacity-50 transition-opacity hover:opacity-100">
            <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-1 ring-primary/20 shadow-inner">
              <IconGripVertical className="size-10 text-primary" />
            </div>
            <p className="text-xl font-medium tracking-tight text-foreground">Your canvas is empty</p>
            <p className="text-sm mt-3 max-w-sm text-center leading-relaxed">Drag and drop fields from the components panel on the left to start building your form.</p>
          </div>
        ) : (
          <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
            {fields.map((field) => (
              <SortableField key={field.id} field={field} />
            ))}
          </SortableContext>
        )}
      </div>

      </div>

      {/* Floating AI Prompt Bar at the bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none px-4 z-50">
        <div className="w-full max-w-3xl pointer-events-auto">
          <AIPromptBar />
        </div>
      </div>
    </div>
  );
}
