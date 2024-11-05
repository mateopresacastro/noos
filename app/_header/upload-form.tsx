import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MutableRefObject, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
  img: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Only one image file allowed"),
  zipFile: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Only one zip file allowed"),
  samples: z
    .instanceof(FileList)
    .refine((files) => files.length > 2 && files.length <= 50),
});

function UploadForm({ ref }: { ref: MutableRefObject<HTMLFormElement> }) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 30,
    },
  });

  const imgRef = form.register("img");
  const zipRef = form.register("zipFile");
  const samplesRef = form.register("samples");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/60 w-screen h-screen z-50">
      <Form {...form}>
        <form
          ref={ref}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-neutral-900 p-20 rounded-xl w-full max-w-xl border-[1px] border-neutral-800 shadow-lg h-96 overflow-y-scroll overflow-hidden"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
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
                  <Input placeholder="Enter description" {...field} />
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
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Main File</FormLabel>
            <FormControl>
              <Input type="file" {...zipRef} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Image File</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" {...imgRef} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Sample Files</FormLabel>
            <FormControl>
              <Input type="file" multiple {...samplesRef} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UploadForm;
