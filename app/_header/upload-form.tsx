import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
  img: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Select on image")
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    ),
  zipFile: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Select one file"),
  samples: z
    .instanceof(FileList)
    .refine((files) => files.length >= 1 && files.length <= 50),
});

function UploadForm() {
  const data = useQuery({
    queryKey: ["upload-form"],
    queryFn: async () => {
      // TODO
    },
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: Infinity,
    retry: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const imgRef = form.register("img");
  const zipRef = form.register("zipFile");
  const samplesRef = form.register("samples");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    // Upload all files
    // Send all data to backend
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-14 w-full pt-8 overflow-y-scroll"
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
          <FormLabel>Cover Art</FormLabel>
          <FormControl>
            <Input type="file" accept="image/*" {...imgRef} />
          </FormControl>
          <FormMessage>{form.formState.errors.img?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Sample Files</FormLabel>
          <FormDescription>
            Samples for display. Make sure they are tagged, they are publicly
            available.
          </FormDescription>
          <FormControl>
            <Input type="file" accept="audio/*" multiple {...samplesRef} />
          </FormControl>
          <FormMessage>{form.formState.errors.samples?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Sample Pack</FormLabel>
          <FormDescription>
            The file that buyers will get. It should contain all sample packs
            and any other information.
          </FormDescription>
          <FormControl>
            <Input type="file" accept=".zip,.rar,.7zip" {...zipRef} />
          </FormControl>
          <FormMessage>{form.formState.errors.zipFile?.message}</FormMessage>
        </FormItem>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default UploadForm;
