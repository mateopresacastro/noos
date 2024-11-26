import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import type { UploadFormSchema } from "@/components/upload-form-schema";
import type { UseFormReturn } from "react-hook-form";

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
