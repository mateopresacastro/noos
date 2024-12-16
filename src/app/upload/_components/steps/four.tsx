import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import type { UploadFormSchema } from "@/app/upload/upload-form-schema";
import type { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export default function StepFour({
  form,
}: {
  form: UseFormReturn<UploadFormSchema>;
}) {
  return (
    <div className="space-y-6 pb-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="will-change-transform"
            >
              <FormLabel className="transition-colors">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full text-sm bg-neutral-800 py-5 mt-1"
                  placeholder="Enter title"
                />
              </FormControl>
            </motion.div>
            <AnimatePresence mode="wait">
              {form.formState.errors[field.name] && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="will-change-transform"
                  layout
                  key="title-message"
                >
                  <FormMessage className="mt-1" />
                </motion.span>
              )}
            </AnimatePresence>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="will-change-transform"
            >
              <FormLabel className="transition-colors">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="w-full text-sm bg-neutral-800 py-5 mt-1"
                  placeholder="Enter description"
                />
              </FormControl>
            </motion.div>
            <AnimatePresence mode="wait">
              {form.formState.errors[field.name] && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="will-change-transform"
                  layout
                  key="title-message"
                >
                  <FormMessage className="mt-1" />
                </motion.span>
              )}
            </AnimatePresence>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
              className="will-change-transform flex flex-col"
            >
              <FormLabel className="bock mb-2 transition-colors">
                Price in USD
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  placeholder="Enter price"
                  className="w-full text-sm bg-neutral-800 py-5 mt-1"
                />
              </FormControl>
            </motion.div>
            <AnimatePresence mode="wait">
              {form.formState.errors[field.name] && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="will-change-transform"
                  layout
                  key="title-message"
                >
                  <FormMessage className="mt-1" />
                </motion.span>
              )}
            </AnimatePresence>
          </FormItem>
        )}
      />
    </div>
  );
}
