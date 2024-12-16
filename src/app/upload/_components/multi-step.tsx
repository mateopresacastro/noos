"use client";

import useMeasure from "react-use-measure";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadPack } from "@/app/upload/use-upload-pack";
import { container, item } from "@/anim";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import {
  uploadFormSchema,
  type UploadFormSchema,
} from "@/app/upload/upload-form-schema";

import StepInfoAndControls from "@/app/upload/_components/info-and-controls";

import {
  StepFive,
  StepFour,
  StepOne,
  StepSix,
  StepThree,
  StepTwo,
} from "@/app/upload/_components/steps/mod";

const VARIANTS = {
  initial: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
  exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
};

const NUMBER_OF_STEPS = 6;

export default function UploadPage({ userName }: { userName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ref, bounds] = useMeasure({ offsetSize: true });

  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      samples: [],
    },
    mode: "all",
  });

  const formValues = form.getValues();

  const { handleUpload, isLoading, isSuccess } = useUploadPack({ formValues });

  const step = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return {
          title: "Choose your samples",
          description:
            "Max size 20MB per sample. Make sure they are tagged since they will be publicly available.",
          component: () => (
            <StepOne
              form={form}
              setDirection={setDirection}
              setStepIndex={setStepIndex}
            />
          ),
        };
      case 1:
        return {
          title: "Organize",
          description: "Name and order the samples.",
          component: () => <StepTwo form={form} />,
        };
      case 2:
        return {
          title: "Cover art",
          description: "Max size 10MB",
          component: () => (
            <StepThree
              form={form}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
            />
          ),
        };
      case 3:
        return {
          title: "General information",
          description: "Select title, description and price.",
          component: () => <StepFour form={form} />,
        };
      case 4:
        return {
          title: "Choose zip file",
          description:
            "This is the file buyers will get. Make sure it has all samples in it. Max size 5GB.",
          component: () => (
            <StepFive
              form={form}
              setDirection={setDirection}
              setStepIndex={setStepIndex}
            />
          ),
        };
      case 5:
        return {
          title: "Review and submit",
          description: "Check that everything is correct and click submit.",
          component: () => (
            <StepSix
              form={form}
              isLoading={isLoading}
              isSuccess={isSuccess}
              userName={userName}
            />
          ),
        };
      default:
        return null;
    }
  }, [stepIndex, previewUrl, isLoading, isSuccess, form, userName]);

  const {
    samples,
    img,
    zipFile,
    title: inputTitle,
    description: inputDescription,
    price: inputPrice,
  } = formValues;

  const numberOfSamples = samples?.length;

  const {
    samples: sampleErrors,
    price: priceError,
    title: titleError,
    description: descriptionError,
  } = form.formState.errors;

  const canGoToTheNextStep = useMemo(() => {
    switch (stepIndex + 1) {
      case 1:
        return numberOfSamples > 0;
      case 2:
        return !sampleErrors;
      case 3:
        return Boolean(img);
      case 4:
        return (
          [priceError, titleError, descriptionError].every((error) => !error) &&
          [inputTitle, inputDescription].every(
            (value) => typeof value === "string" && value !== ""
          ) &&
          inputPrice > 0
        );
      case 5:
        return Boolean(zipFile);
      case 6:
        return true;
      default:
        return false;
    }
  }, [
    stepIndex,
    numberOfSamples,
    img,
    sampleErrors,
    zipFile,
    priceError,
    titleError,
    descriptionError,
    inputTitle,
    inputDescription,
    inputPrice,
  ]);

  if (!step) return null;
  const { title, description, component: Step } = step;

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-start min-h-screen pt-32 pb-48 will-change-transform"
      >
        <motion.div variants={item} className="w-full max-w-2xl">
          <h3 className="self-start font-bold pb-3">Upload a sample pack</h3>
        </motion.div>
        <motion.div
          variants={item}
          animate={{ height: bounds.height + 51 }}
          className="flex items-start justify-start flex-col bg-neutral-900 p-6 rounded-xl border-neutral-800 border max-w-2xl w-full overflow-hidden relative"
        >
          <div ref={ref} className="w-full">
            <StepInfoAndControls
              stepIndex={stepIndex}
              form={form}
              setStepIndex={setStepIndex}
              setDirection={setDirection}
              canGoToTheNextStep={canGoToTheNextStep}
              steps={NUMBER_OF_STEPS}
              handleUpload={handleUpload}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
            <Form {...form}>
              <form
                className="w-full"
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  <motion.div
                    variants={VARIANTS}
                    initial="initial"
                    animate="active"
                    exit="exit"
                    custom={direction}
                    key={`step-${stepIndex}`}
                  >
                    <h4 className="font-bold">{title}</h4>
                    <p className="text-neutral-400 text-xs text-pretty pt-1 pb-8">
                      {description}
                    </p>
                    <Step />
                  </motion.div>
                </AnimatePresence>
              </form>
            </Form>
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
