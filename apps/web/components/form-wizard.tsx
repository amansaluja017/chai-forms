"use client";

import { useState } from "react";
import { FormWorkspaceOutputType } from "@repo/services/form/model";
import { Button } from "~/components/ui/button";
import { useSubmitFormResponse } from "~/hooks/api/form/form.hook";
import { toast } from "sonner";
import { IconCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { useEffect, useRef } from "react";
import { useTrackFormView } from "~/hooks/api/analytics/analytics.hook";
import renderFieldInput from "./render-file-input";

export function FormWizard({ form, isPreview = false }: { form: FormWorkspaceOutputType, isPreview?: boolean }) {
  const fields = form.fields || [];
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  
  const { submitResponseAsync, isPending } = useSubmitFormResponse();
  const { trackViewAsync } = useTrackFormView();
  const startTime = useRef(Date.now());
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!isPreview && !hasTrackedView.current && form.id) {
      hasTrackedView.current = true;
      trackViewAsync({ id: form.id }).catch(console.error);
    }
  }, [isPreview, form.id, trackViewAsync]);

  const isFormPending = isPending || isMockSubmitting;

  if (fields.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          This form has no fields.
        </CardContent>
      </Card>
    );
  }

  const currentField = fields[currentStep];
  if (!currentField) return null;

  const isLastStep = currentStep === fields.length - 1;
  const progress = ((currentStep) / fields.length) * 100;

  const handleNext = async () => {
    // Validate current field
    if (currentField.isRequired && !responses[currentField.id!]) {
      toast.error("This field is required");
      return;
    }

    if (isLastStep) {
      if (isPreview) {
        setIsMockSubmitting(true);
        setTimeout(() => {
          setIsMockSubmitting(false);
          setIsSubmitted(true);
        }, 1000);
        return;
      }

      // Submit
      try {
        const payload = Object.entries(responses).map(([formFieldId, value]) => ({
          formFieldId,
          value
        }));

        const timeToComplete = Math.floor((Date.now() - startTime.current) / 1000);

        await submitResponseAsync({
          formId: form.id,
          response: payload,
          timeToComplete
        });
        
        setIsSubmitted(true);
      } catch (error) {
        toast.error("Failed to submit response. Please try again.");
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const setResponse = (val: string) => {
    setResponses(prev => ({ ...prev, [currentField.id!]: val }));
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
            <IconCheck className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Thank You!</h2>
          <p className="text-green-600/80 dark:text-green-400/80">Your response has been recorded successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentStep + 1} of {fields.length}</span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg border-muted">
        <CardContent className="pt-8 pb-8 px-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-medium">
              {currentField.label} {currentField.isRequired && <span className="text-red-500">*</span>}
            </h2>
            {currentField.description && (
              <p className="text-muted-foreground text-sm">{currentField.description}</p>
            )}
          </div>

          <div className="pt-4">
            {renderFieldInput(currentField, responses[currentField.id!] || "", setResponse)}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={currentStep === 0 || isFormPending}
          className="gap-2"
        >
          <IconChevronLeft className="size-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={isFormPending}
          className="gap-2"
        >
          {isLastStep ? "Submit" : "Next"}
          {!isLastStep && <IconChevronRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
