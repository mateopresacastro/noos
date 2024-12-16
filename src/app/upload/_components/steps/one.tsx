import Dropzone from "react-dropzone";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { UploadFormSchema } from "@/app/upload/upload-form-schema";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";

export default function StepOne({
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
