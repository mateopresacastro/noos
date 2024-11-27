import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { UploadFormSchema } from "@/components/upload-form-schema";
import { ArrowLeft, Loader, ArrowRight } from "lucide-react";

import type { Dispatch, SetStateAction } from "react";

export default function StepInfoAndControls({
  stepIndex,
  setStepIndex,
  canGoToTheNextStep,
  steps,
  setDirection,
  handleUpload,
  isLoading,
  isSuccess,
}: {
  stepIndex: number;
  form: UseFormReturn<UploadFormSchema>;
  setStepIndex: Dispatch<SetStateAction<number>>;
  setDirection: Dispatch<SetStateAction<number>>;
  canGoToTheNextStep: boolean;
  steps: number;
  handleUpload: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}) {
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps - 1;

  function handleNextClick() {
    setDirection(1);
    setStepIndex(stepIndex + 1);
  }

  function handlePreviousClick() {
    if (isFirstStep) return;
    setDirection(-1);
    setStepIndex(stepIndex - 1);
  }

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="w-full flex items-center justify-between">
        <div className="font-bold text-neutral-500 text-xs pb-2 flex items-center justify-center w-[3.8rem]">
          <span>Step</span>
          <span className="mx-auto">
            <NumberFlow willChange value={stepIndex + 1} />
          </span>
          <span className="pt-0.5">of {steps}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 w-full pb-3">
        {new Array(steps).fill(null).map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-neutral-800 w-full h-1 rounded-full transition-colors duration-150",
              index < stepIndex + 1 && "bg-neutral-300"
            )}
          />
        ))}
      </div>
      <div className="w-full flex items-center justify-between pb-10 mt-1">
        <Button
          variant="secondary"
          onClick={handlePreviousClick}
          disabled={isFirstStep || isLoading || isSuccess}
          className="active:scale-90 w-10"
        >
          <ArrowLeft className="text-neutral-400" />
        </Button>
        <Button
          variant={canGoToTheNextStep ? "default" : "secondary"}
          type={isLastStep ? "submit" : "button"}
          className={cn(
            "transition-all active:scale-90",
            isLastStep ? "w-20" : "w-10"
          )}
          onClick={isLastStep ? handleUpload : handleNextClick}
          disabled={!canGoToTheNextStep || isLoading || isSuccess}
        >
          {isLastStep ? (
            isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              "Submit"
            )
          ) : (
            <ArrowRight />
          )}
        </Button>
      </div>
    </div>
  );
}
