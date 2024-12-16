import { Grip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type UseFormReturn, useFieldArray } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Reorder,
  useDragControls,
  motion,
  AnimatePresence,
} from "framer-motion";

import type { UploadFormSchema } from "@/app/upload/upload-form-schema";

export default function StepTwo({
  form,
}: {
  form: UseFormReturn<UploadFormSchema>;
}) {
  const { fields: samples, replace } = useFieldArray({
    control: form.control,
    name: "samples",
  });

  function handleReorder(newOrder: UploadFormSchema["samples"]) {
    const currentSamples = form.getValues().samples;
    const swappedFiles = newOrder.map((item) => {
      const matchingSample = currentSamples.find(
        (sample) => sample.file.name === item.file.name
      );
      return matchingSample || item;
    });
    replace(swappedFiles);
  }

  return (
    <div className="w-full">
      <Reorder.Group
        values={samples}
        onReorder={handleReorder}
        className="space-y-6"
      >
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
          render={({ field }) => (
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
                    {...field}
                    className="w-full text-sm bg-neutral-800 py-5 mb-1"
                    placeholder="Enter name"
                    onClick={(e) => e.stopPropagation()}
                    id={`samples.${index}.generatedName`}
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
