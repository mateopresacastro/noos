import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Check } from "lucide-react";

import type { UseFormReturn } from "react-hook-form";
import type { UploadFormSchema } from "@/components/upload-form-schema";

export default function StepSix({
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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full flex items-center justify-center gap-3 flex-col py-20"
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
          className="w-full flex items-center justify-center gap-3 flex-col py-20"
        >
          <Check />
          <p className="text-sm text-neutral-400">
            Success! You can check your pack in your profile
          </p>
          <Link href={`/${userName}`} prefetch={true}>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
