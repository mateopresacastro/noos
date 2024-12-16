import Dropzone from "react-dropzone";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { UploadFormSchema } from "@/app/upload/upload-form-schema";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import type { Dispatch, SetStateAction } from "react";

export default function StepFive({
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
