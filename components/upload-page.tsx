"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Grip } from "lucide-react";
import Dropzone from "react-dropzone";
import { cn } from "@/lib/utils";
import {
  UploadFormSchema,
  uploadFormSchema,
} from "@/components/upload-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form";
import { Reorder, useDragControls } from "motion/react";

const steps = [
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
    title: "Sample pack data",
    description: "Select cover art, title and description.",
    component: StepThree,
  },
  {
    title: "Choose zip file",
    description:
      "This is the file buyers will get. Make sure it has all samples in it. Max size 5GB.",
    component: StepFour,
  },
  {
    title: "Review",
    description: "Check that everything is correct and click submit.",
    component: StepFive,
  },
];

export default function UploadPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  console.log("on form comp", form.getValues());

  const {
    title,
    description,
    component: Step,
  } = useMemo(() => steps[stepIndex], [stepIndex]);

  const numberOfSamples = form.getValues().samples?.length;

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
      default:
        return false;
    }
  }, [stepIndex, numberOfSamples]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-32 pb-48">
      <div className="w-full max-w-xl">
        <h3 className="self-start font-medium pb-3">Upload a sample pack</h3>
      </div>
      <div className="flex items-start justify-start flex-col bg-neutral-900 p-6 rounded-xl border-neutral-800 border max-w-xl w-full">
        <StepInfoAndControls
          title={title}
          description={description}
          stepIndex={stepIndex}
          form={form}
          setStepIndex={setStepIndex}
          canGoToTheNextStep={canGoToTheNextStep}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => console.log("Submit"))}
            className="w-full pt-8"
          >
            <Step form={form} />
          </form>
        </Form>
      </div>
    </div>
  );
}

function StepInfoAndControls({
  title,
  description,
  stepIndex,
  form,
  setStepIndex,
  canGoToTheNextStep,
}: {
  title: string;
  description: string;
  stepIndex: number;
  form: UseFormReturn<UploadFormSchema>;
  setStepIndex: Dispatch<SetStateAction<number>>;
  canGoToTheNextStep: boolean;
}) {
  console.log({ canGoToTheNextStep, stepIndex });
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <div className="w-full flex items-center justify-between">
        <span className="font-medium text-neutral-400 text-xs pb-2">
          Step {stepIndex + 1} of 5
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 w-full pb-3">
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "bg-neutral-700 w-full h-1 rounded-full",
              index < stepIndex + 1 && "bg-neutral-100"
            )}
          />
        ))}
      </div>
      <div className="w-full flex items-center justify-between pb-10 mt-1">
        <Button
          variant="secondary"
          onClick={() => setStepIndex(stepIndex - 1)}
          disabled={stepIndex === 0}
        >
          <ArrowLeft className="text-neutral-400" />
        </Button>
        <Button
          variant={
            stepIndex === 0 && form.getValues().samples?.length > 0
              ? "default"
              : "secondary"
          }
          className="transition-all"
          onClick={() => setStepIndex(stepIndex + 1)}
          disabled={!canGoToTheNextStep}
        >
          <ArrowRight />
        </Button>
      </div>

      <h4 className="font-medium">{title}</h4>
      <p className="text-neutral-400 text-xs text-pretty py-1">{description}</p>
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
                <section className="bg-neutral-800 p-6 rounded-xl border-neutral-600 border w-full border-dashed cursor-pointer active:bg-neutral-800/80">
                  <div
                    {...getRootProps()}
                    className="flex items-center justify-center h-96"
                  >
                    <Input {...getInputProps()} />
                    <p className="text-neutral-400 text-xs">
                      {acceptedFiles?.length > 0 || field.value?.length > 0
                        ? `${
                            field.value?.length > 0
                              ? field.value?.length
                              : acceptedFiles.length
                          } files selected. Go to the next step to continue.`
                        : "Drag and drop your samples here. Or click to select."}
                    </p>
                  </div>
                  <FormMessage>
                    {form.formState.errors.samples?.message}
                  </FormMessage>
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

function StepTwo({ form }: { form: UseFormReturn<UploadFormSchema> }) {
  const { fields: samples, replace } = useFieldArray({
    control: form.control,
    name: "samples",
  });

  return (
    <div className="w-full">
      <Reorder.Group values={samples} onReorder={replace} className="space-y-5">
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
      className="flex items-start justify-between flex-col-reverse sm:flex-row sm:items-center sm:justify-between select-none"
    >
      <div className="flex items-center w-full">
        <Grip
          className="text-neutral-600 mr-3 cursor-grab active:cursor-grabbing size-5 active:text-neutral-300 transition-colors duration-150 touch-none"
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
        />
        <FormField
          control={form.control}
          name={`samples.${index}.generatedName`}
          render={({ field: nameField }) => (
            <FormItem className="w-full sm:w-3/4">
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
      </div>
      <span className="pb-1 sm:pb-0 sm:px-3 text-xs text-neutral-500 text-nowrap block">
        {sample.file.name}
      </span>
    </Reorder.Item>
  );
}

function StepThree() {
  return <div>Step 3</div>;
}

function StepFour() {
  return <div>Step 4</div>;
}

function StepFive() {
  return <div>Step 5</div>;
}
