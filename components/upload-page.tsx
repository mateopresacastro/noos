"use client";

import Dropzone from "react-dropzone";
import NumberFlow from "@number-flow/react";
import useMeasure from "react-use-measure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { cn } from "@/lib/utils";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  Reorder,
  useDragControls,
} from "motion/react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  uploadFormSchema,
  type UploadFormSchema,
} from "@/components/upload-form-schema";

import { ArrowLeft, ArrowRight, Grip } from "lucide-react";
import { useUploadPack } from "@/hooks/upload-pack";
import Link from "next/link";

const STEPS = [
  {
    title: "Choose your samples",
    description:
      "Max size 20MB per sample. Make sure they are tagged since they will be publicly available.",
    component: StepOne,
  },
  {
    title: "Organize",
    description: "Name and order the samples.",
    component: StepTwo,
  },
  {
    title: "Cover art",
    description: "Max size 10MB",
    component: StepThree,
  },
  {
    title: "General information",
    description: "Select title, description and price.",
    component: StepFour,
  },
  {
    title: "Choose zip file",
    description:
      "This is the file buyers will get. Make sure it has all samples in it. Max size 5GB.",
    component: StepFive,
  },
  {
    title: "Review and submit",
    description: "Check that everything is correct and click submit.",
    component: StepSix,
  },
];

const VARIANTS = {
  initial: (direction: number) => ({ x: `${110 * direction}%`, opacity: 0 }),
  exit: (direction: number) => ({ x: `${-110 * direction}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
};

export default function UploadPage({ userName }: { userName: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [ref, bounds] = useMeasure({ offsetSize: true });
  const [direction, setDirection] = useState(1);

  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "all",
  });

  const formValues = form.getValues();

  const { handleUpload, isLoading, isSuccess } = useUploadPack({ formValues });

  const {
    title,
    description,
    component: Step,
  } = useMemo(() => STEPS[stepIndex], [stepIndex]);

  const numberOfSamples = form.getValues().samples?.length;

  // TODO check errors before letting user go to next step
  const canGoToTheNextStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return numberOfSamples > 0;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  }, [stepIndex, numberOfSamples]);

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <div className="flex flex-col items-center justify-start min-h-screen pt-32 pb-48">
        <div className="w-full max-w-2xl">
          <h3 className="self-start font-bold pb-3">Upload a sample pack</h3>
        </div>
        <motion.div
          animate={{ height: bounds.height + 51 }} // TODO: fix magic number. Bound is wrong
          className="flex items-start justify-start flex-col bg-neutral-900 p-6 rounded-xl border-neutral-800 border max-w-2xl w-full overflow-hidden relative"
        >
          <div ref={ref} className="w-full">
            <StepInfoAndControls
              stepIndex={stepIndex}
              form={form}
              setStepIndex={setStepIndex}
              setDirection={setDirection}
              canGoToTheNextStep={canGoToTheNextStep}
              steps={STEPS}
              handleUpload={handleUpload}
              isLoading={isLoading}
            />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => handleUpload())}
                className="w-full"
                autoComplete="off"
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
                    <Step form={form} />
                    {/* TODO: finish this */}
                    {isSuccess ? (
                      <Link href={`/${userName}`}>
                        <Button>Go back your profile</Button>
                      </Link>
                    ) : isLoading ? (
                      "Loading..."
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

function StepInfoAndControls({
  stepIndex,
  setStepIndex,
  canGoToTheNextStep,
  steps,
  setDirection,
  handleUpload,
  isLoading,
}: {
  stepIndex: number;
  form: UseFormReturn<UploadFormSchema>;
  setStepIndex: Dispatch<SetStateAction<number>>;
  setDirection: Dispatch<SetStateAction<number>>;
  canGoToTheNextStep: boolean;
  steps: typeof STEPS;
  handleUpload: () => void;
  isLoading: boolean;
}) {
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  function handleNextClick() {
    setDirection(1);
    setStepIndex(stepIndex + 1);
  }

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="w-full flex items-center justify-between">
        <div className="font-bold text-neutral-500 text-xs pb-2 flex items-center justify-center w-[3.8rem]">
          <span>Step</span>
          <span className="mx-auto">
            <NumberFlow willChange value={stepIndex + 1} />
          </span>
          <span className="pt-0.5">of 5</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 w-full pb-3">
        {steps.map((_, index) => (
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
          onClick={() => {
            if (isFirstStep) {
              return;
            }
            setStepIndex(stepIndex - 1);
            setDirection(-1);
          }}
          disabled={isFirstStep || isLoading}
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
          disabled={!canGoToTheNextStep || isLoading}
        >
          {isLastStep ? isLoading ? "Loading..." : "Submit" : <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}

function StepOne({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  return (
    <FormField
      control={form.control}
      name="samples"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Dropzone
              onDrop={(acceptedFiles) => {
                const samplesWithNames = acceptedFiles.map((file) => ({
                  file,
                  generatedName: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                }));
                field.onChange(samplesWithNames);
              }}
              accept={{ "audio/*": [".mp3"] }}
            >
              {({ getRootProps, getInputProps, acceptedFiles }) => (
                <section className="bg-neutral-900 p-6 rounded-xl border-neutral-600 border w-full border-dashed cursor-pointer active:bg-neutral-800/80 hover:bg-neutral-800 transition-all duration-150">
                  <div
                    {...getRootProps()}
                    className="flex items-center justify-center h-48"
                  >
                    <Input {...getInputProps()} />
                    <p className="text-neutral-500 text-xs text-center sm:text-left">
                      {acceptedFiles?.length > 0 || field.value?.length > 0
                        ? `${
                            field.value?.length > 0
                              ? field.value?.length
                              : acceptedFiles.length
                          } files selected. Go to the next step to continue.`
                        : "Drag and drop your samples here. Or click to select."}
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function StepTwo({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  const { fields: samples, replace } = useFieldArray({
    control: form.control,
    name: "samples",
  });
  return (
    <div className="w-full">
      <Reorder.Group values={samples} onReorder={replace} className="space-y-6">
        {samples.map((sample, index) => (
          <ReorderSample
            key={sample.file.name}
            form={form}
            sample={sample}
            index={index}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}

function ReorderSample({
  form,
  sample,
  index,
}: {
  form: UseFormReturn<UploadFormSchema>;
  sample: UploadFormSchema["samples"][number];
  index: number;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      key={sample.file.name}
      value={sample}
      dragListener={false}
      dragControls={controls}
      className="flex items-start justify-between flex-col-reverse select-none"
    >
      <div className="flex items-center w-full py-1">
        <span className="pr-3 text-neutral-300 text-xs block">{index}</span>
        <FormField
          control={form.control}
          name={`samples.${index}.generatedName`}
          render={({ field: nameField }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  {...nameField}
                  className="w-full text-sm bg-neutral-800 py-5"
                  placeholder="Enter name"
                  onClick={(e) => e.stopPropagation()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Grip
          className="text-neutral-600 ml-3 cursor-grab active:cursor-grabbing size-5 transition-colors duration-150 touch-none"
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
        />
      </div>
      <span className="pb-1 text-xs text-neutral-500 text-nowrap block pl-5">
        {sample.file.name}
      </span>
    </Reorder.Item>
  );
}

function StepThree({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="img"
        render={({ field }) => (
          <div className="flex items-center justify-center w-full h-48">
            <FormItem>
              <FormControl>
                <Dropzone
                  maxFiles={1}
                  accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                  }}
                  onDrop={(acceptedFiles) => {
                    if (acceptedFiles.length <= 0) return;
                    field.onChange(acceptedFiles[0]);
                    const url = URL.createObjectURL(acceptedFiles[0]);
                    setPreviewUrl(url);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      className="bg-neutral-900 rounded-xl border-neutral-600 border border-dashed cursor-pointer active:bg-neutral-800/80 hover:bg-neutral-800 overflow-hidden w-full transition-all duration-150 h-48"
                    >
                      <Input {...getInputProps()} />
                      {previewUrl ? (
                        <div className="relative aspect-square h-48">
                          <img
                            src={previewUrl}
                            alt="Cover art preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-sm">
                              Click to change image
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center">
                          <p className="text-neutral-400 text-xs text-center px-6">
                            Drop your cover art here or click to select
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        )}
      />
    </div>
  );
}

function StepFour({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  return (
    <div className="space-y-6 pb-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-full text-sm bg-neutral-800 py-5"
                placeholder="Enter title"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-full text-sm bg-neutral-800 py-5"
                placeholder="Enter description"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price in USD</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter price"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value ?? 0))}
                className="w-full text-sm bg-neutral-800 py-5"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function StepFive({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  return (
    <FormField
      control={form.control}
      name="zipFile"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Dropzone
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                  field.onChange(acceptedFiles[0]);
                }
              }}
              accept={{ "application/zip": [".zip"] }}
              maxFiles={1}
            >
              {({ getRootProps, getInputProps, acceptedFiles }) => (
                <section className="bg-neutral-900 p-6 rounded-xl border-neutral-600 border w-full border-dashed cursor-pointer active:bg-neutral-800/80 hover:bg-neutral-800 transition-all duration-150">
                  <div
                    {...getRootProps()}
                    className="flex items-center justify-center h-48"
                  >
                    <Input {...getInputProps()} />
                    <p className="text-neutral-500 text-xs text-center sm:text-left">
                      {acceptedFiles.length > 0 || field.value
                        ? `Selected file: ${
                            acceptedFiles[0]?.name ?? field.value?.name
                          }. Go to the next step to continue.`
                        : "Drag and drop your ZIP file here, or click to select."}
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StepSix() {
  return null;
}
