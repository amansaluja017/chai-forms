"use client";

import { useState, useEffect, useRef } from "react";
import { IconSparkles, IconMicrophone, IconPlayerStopFilled, IconSend } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useGenerateFormWithAI } from "~/hooks/api/form/form.hook";
import { useFormBuilder } from "./workspace/context";
import { toast } from "sonner";
import { trpc } from "~/trpc/client";

export function AIPromptBar() {
  const { formId } = useFormBuilder();
  const { generateWithAIAsync, isPending } = useGenerateFormWithAI();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    // Only initialize if we're in the browser and speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
             setAiPrompt(prev => {
                const prefix = prev ? prev.trim() + ' ' : '';
                return prefix + finalTranscript.trim();
             });
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error !== 'no-speech') {
            toast.error(`Speech recognition error: ${event.error}`);
            setIsRecording(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!hasSpeechSupport) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    try {
      const result = await generateWithAIAsync({ formId, prompt: aiPrompt });
      if (result?.success) {
        await utils.form.getFormWorkspace.invalidate({ id: formId });
        toast.success("Successfully updated form using AI!");
        setAiPrompt("");
      }
    } catch (error) {
      toast.error("Failed to generate form fields. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div className={`relative flex items-end gap-2 bg-background/80 backdrop-blur-xl border border-white/20 p-2 rounded-3xl shadow-2xl transition-all duration-500 ${isPending ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20 translate-y-[-4px]' : 'hover:border-white/40 hover:shadow-primary/10'}`}>
        
        {/* Glow effect when generating */}
        {isPending && (
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-30 blur-xl animate-pulse" />
        )}

        <div className="relative flex-1">
          <Textarea 
            placeholder={isRecording ? "Listening..." : "Ask AI to modify or add fields..."}
            className={`min-h-[50px] max-h-[150px] py-3 px-4 resize-none bg-transparent border-0 focus-visible:ring-0 shadow-none transition-all duration-300 ${isRecording ? 'text-indigo-500 dark:text-indigo-400 placeholder:text-indigo-400/50' : ''}`}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            disabled={isPending}
          />
        </div>

        <div className="flex gap-1 pb-1 pr-1">
          {hasSpeechSupport && (
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "destructive" : "ghost"}
              className={`rounded-full size-10 shrink-0 transition-all duration-300 ${isRecording ? 'animate-pulse scale-110 shadow-lg shadow-red-500/40' : 'hover:bg-primary/10 text-muted-foreground hover:text-foreground'}`}
              onClick={toggleRecording}
              disabled={isPending}
              title={isRecording ? "Stop recording" : "Use microphone"}
            >
              {isRecording ? <IconPlayerStopFilled className="size-5" /> : <IconMicrophone className="size-5" />}
            </Button>
          )}

          <Button 
            type="button"
            size="icon"
            className="rounded-full size-10 shrink-0 bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md border-0 transition-transform active:scale-95"
            onClick={handleGenerate} 
            disabled={isPending || !aiPrompt.trim()}
          >
            {isPending ? <IconSparkles className="size-5 animate-pulse" /> : <IconSend className="size-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
