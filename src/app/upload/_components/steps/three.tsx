import Dropzone from "react-dropzone";
import { Input } from "@/components/ui/input";
import { UploadFormSchema } from "@/app/upload/upload-form-schema";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";

export default function StepThree({
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
