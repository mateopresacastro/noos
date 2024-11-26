"use client";

import Link from "next/link";
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

import { ArrowLeft, ArrowRight, Grip, Loader, Check } from "lucide-react";
import { useUploadPack } from "@/hooks/upload-pack";

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

  if (!step) return null;
  const { title, description, component: Step } = step;

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
              steps={NUMBER_OF_STEPS}
              handleUpload={handleUpload}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
            <Form {...form}>
              <form className="w-full" autoComplete="off">
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

function StepOne({
  form,
  setStepIndex,
  setDirection,
}: {
  form: UseFormReturn<UploadFormSchema>;
  setStepIndex: Dispatch<SetStateAction<number>>;
  setDirection: Dispatch<SetStateAction<number>>;
}) {
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
                setStepIndex(1);
                setDirection(1);
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
      className="flex items-start justify-between flex-col select-none"
    >
      <motion.span
        layout
        className="pb-1 text-xs text-neutral-500 text-nowrap block pl-5 will-change-transform"
      >
        {sample.file.name}
      </motion.span>
      <motion.div className="flex items-center w-full py-1">
        <motion.span
          layout
          className="pr-3 text-neutral-300 text-xs block will-change-transform"
        >
          {index + 1}
        </motion.span>
        <FormField
          control={form.control}
          name={`samples.${index}.generatedName`}
          render={({ field: nameField }) => (
            <FormItem className="w-full">
              <FormControl>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="will-change-transform"
                >
                  <Input
                    {...nameField}
                    className="w-full text-sm bg-neutral-800 py-5 mb-1"
                    placeholder="Enter name"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              </FormControl>
              <AnimatePresence mode="wait">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="will-change-transform"
                >
                  <FormMessage />
                </motion.span>
              </AnimatePresence>
            </FormItem>
          )}
        />
        <motion.div layout>
          <Grip
            className="text-neutral-600 ml-3 cursor-grab active:cursor-grabbing size-5 transition-colors duration-150 touch-none"
            onPointerDown={(e) => {
              e.preventDefault();
              controls.start(e);
            }}
          />
        </motion.div>
      </motion.div>
    </Reorder.Item>
  );
}

function StepThree({
  form,
  previewUrl,
  setPreviewUrl,
}: {
  form: UseFormReturn<UploadFormSchema>;
  previewUrl: string | null;
  setPreviewUrl: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="img"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Dropzone
                maxFiles={1}
                accept={{
                  "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                }}
                onDrop={(acceptedFiles) => {
                  if (acceptedFiles.length <= 0) return;
                  const file = acceptedFiles[0];
                  field.onChange(file);
                  const url = URL.createObjectURL(file);
                  console.log("here n accepted giles");
                  setPreviewUrl(url);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    className="bg-neutral-900 rounded-3xl w-full border-neutral-600 border border-dashed cursor-pointer active:bg-neutral-800/80 hover:bg-neutral-800 overflow-hidden transition-all duration-150 flex items-center justify-center max-w-96 mx-auto h-96"
                  >
                    <Input {...getInputProps()} />
                    {previewUrl ? (
                      <div className="relative aspect-square">
                        <img
                          src={previewUrl}
                          alt="Cover art preview"
                          className="w-full h-full object-cover rounded-3xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-xs text-center px-6">
                        Drop your cover art here or click to select
                      </p>
                    )}
                  </div>
                )}
              </Dropzone>
            </FormControl>
            <FormMessage />
          </FormItem>
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
            <FormLabel className="transition-colors">Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-full text-sm bg-neutral-800 py-5"
                placeholder="Enter title"
              />
            </FormControl>
            <AnimatePresence mode="wait">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="will-change-transform"
                layout
              >
                <FormMessage className="mt-1" />
              </motion.span>
            </AnimatePresence>
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
                onChange={(e) => field.onChange(Number(e.target.value))}
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

function StepFive({
  form,
  setDirection,
  setStepIndex,
}: {
  form: UseFormReturn<UploadFormSchema>;
  setDirection: Dispatch<SetStateAction<number>>;
  setStepIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <FormField
      control={form.control}
      name="zipFile"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Dropzone
              onDrop={(acceptedFiles) => {
                if (acceptedFiles.length <= 0) return;
                field.onChange(acceptedFiles[0]);
                setDirection(1);
                setStepIndex(5);
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

function StepSix({
  form,
  isLoading,
  isSuccess,
  userName,
}: {
  form: UseFormReturn<UploadFormSchema>;
  isLoading: boolean;
  isSuccess: boolean;
  userName: string;
}) {
  const values = form.getValues();
  console.log({ isLoading, isSuccess });

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full flex items-center justify-center gap-6 flex-col py-20"
        >
          <Loader className="animate-spin" />
          <p className="text-sm text-neutral-400">
            Uploading files, this can take a couple of minutes...
          </p>
        </motion.div>
      ) : isSuccess ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full flex items-center justify-center gap-6 flex-col py-20"
        >
          <Check />
          <p className="text-sm text-neutral-400">
            Success! You can check your pack in your profile
          </p>
          <Link href={`/${userName}`}>
            <Button className="py-6">Go to profile</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-6 pb-1"
        >
          {values.img && (
            <div className="max-w-80 max-h-80 w-full mx-auto">
              <img
                src={URL.createObjectURL(values.img)}
                alt="Cover art preview"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <div className="bg-neutral-800 rounded-xl p-4 space-y-4">
            <h5 className="text-xs text-neutral-400 mb-2">
              General Information
            </h5>
            <div className="space-y-2">
              <div className="flex justify-start text-sm gap-2">
                <span className="text-neutral-400">Title:</span>
                <span className="text-neutral-50">{values.title}</span>
              </div>
              <div className="flex justify-start text-sm gap-2">
                <span className="text-neutral-400">Description:</span>
                <span className="text-neutral-50">{values.description}</span>
              </div>
              <div className="flex justify-start text-sm gap-2">
                <span className="text-neutral-400">Price:</span>
                <span className="text-neutral-50">
                  ${values.price?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-neutral-800 rounded-xl p-4 space-y-4">
            <h5 className="text-xs text-neutral-400 mb-2">Samples</h5>
            <ul className="space-y-2">
              {values.samples?.map((sample, index) => (
                <li
                  key={sample.file.name}
                  className="flex justify-start items-baseline text-sm text-neutral-300 gap-2"
                >
                  <span className="text-xs text-neutral-400">{index + 1}</span>
                  <span className="text-neutral-50">
                    {sample.generatedName}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {values.zipFile && (
            <div className="bg-neutral-800 rounded-xl p-4 space-y-4">
              <h5 className="text-xs text-neutral-400 mb-2">
                File buyers will get
              </h5>
              <div className="flex justify-start gap-2 items-baseline text-sm text-neutral-300">
                <span className="text-neutral-400">File:</span>
                <span className=" text-neutral-50">
                  {values.zipFile.name} (
                  {(values.zipFile.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
