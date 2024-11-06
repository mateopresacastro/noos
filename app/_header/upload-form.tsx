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
import { useMutation } from "@tanstack/react-query";
import { handleCreatePreSignedUrl, handlePersistData } from "@/lib/aws/actions";
import { handleUploadToS3, type UploadToS3Data } from "@/lib/aws/upload";

const ONE_GB_IN_BYTES = 1000 * 1024 * 1024;
const FIVE_MB_IN_BYTES = 5 * 1024 * 1024;

const uploadFormSchema = z.object({
  title: z.string().min(5).max(50),
  description: z.string().min(5).max(100).optional(),
  price: z.number().min(0),
  img: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Select on image")
    .refine(
      (files) => files[0]?.size <= FIVE_MB_IN_BYTES,
      "Image must be less than 5MB"
    )
    .refine(
      (files) => files[0]?.type.startsWith("image/"),
      "File must be an image"
    ),
  zipFile: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Select one file")
    .refine(
      (files) => files[0]?.size <= ONE_GB_IN_BYTES,
      "Zip must be less than 1GB"
    )
    .refine(
      (files) => files[0]?.type === "application/zip",
      "File must be in ZIP format"
    ),
  samples: z
    .instanceof(FileList)
    .refine((files) => files.length >= 1 && files.length <= 100)
    .refine((files) => {
      const totalSize = Array.from(files).reduce(
        (acc, file) => acc + file.size,
        0
      );
      return totalSize <= ONE_GB_IN_BYTES;
    }, "The total of the samples must be less than 1GB")
    .refine(
      (files) =>
        Array.from(files).every((file) => file.type.startsWith("audio/")),
      "Each sample file must be an audio file"
    ),
});

export type UploadFormSchema = z.infer<typeof uploadFormSchema>;

function UploadForm() {
  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const {
    mutate: createPreSignedUrls,
    data: preSignedUrls,
    isError: isPresignedUrlsError,
    isPending: isCreatingPresignedUrls,
  } = useMutation({
    mutationFn: () =>
      handleCreatePreSignedUrl({
        numOfSamples: form.getValues().samples.length,
      }),
    onSuccess: (preSignedUrls) => {
      return uploadToS3({
        zipFileSignedUrl: preSignedUrls.zipFileSignedUrl.url,
        zipFile: form.getValues().zipFile[0],
        imageSignedUrl: preSignedUrls.imageSignedUrl.url,
        image: form.getValues().img[0],
        samplesSignedUrls: preSignedUrls.samplesSignedUrls.map(
          ({ url }) => url
        ),
        samples: form.getValues().samples,
      });
    },
    onSettled: () => console.log("Pre-signed URLs creation is done"),
  });

  const { mutate: uploadToS3, isPending: isUploadingToS3 } = useMutation({
    mutationFn: async (data: UploadToS3Data) => {
      await handleUploadToS3(data);
    },
    onSuccess: () => persistData(),
  });

  function createPublicUrl({
    key,
    visibility,
  }: {
    key: string;
    visibility: "private" | "public";
  }) {
    const bucketName =
      visibility === "private" ? "noos-private-assets" : "noos-public-assets";
    return `https://localhost.localstack.cloud:4566/${bucketName}/${key}`;
  }

  const { mutate: persistData, isPending: isPersistingData } = useMutation({
    mutationFn: async () => {
      if (!preSignedUrls) throw new Error("Pre-signed urls not found");
      await handlePersistData({
        samplePack: {
          samplePackName: form
            .getValues()
            .title.split(" ")
            .map((word) =>
              word
                .split("")
                .map((char) => char.toLowerCase())
                .join("")
            )
            .join("-"),
          description: form.getValues().description,
          price: form.getValues().price,
          imgUrl: createPublicUrl({
            key: preSignedUrls.imageSignedUrl.key,
            visibility: "public",
          }),
          title: form.getValues().title,
          url: createPublicUrl({
            key: preSignedUrls.zipFileSignedUrl.key,
            visibility: "public",
          }),
        },
        samples: preSignedUrls?.samplesSignedUrls.map(({ key }) => ({
          url: createPublicUrl({ key, visibility: "public" }),
        })),
      });
    },
    onSuccess: () => console.log("Data persisted"),
  });

  const imgRef = form.register("img");
  const zipRef = form.register("zipFile");
  const samplesRef = form.register("samples");

  function onSubmit() {
    createPreSignedUrls();
  }

  console.log({
    preSignedUrls,
    isCreatingPresignedUrls,
    isPresignedUrlsError,
  });

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
            <Input type="file" accept="application/zip" {...zipRef} />
          </FormControl>
          <FormMessage>{form.formState.errors.zipFile?.message}</FormMessage>
        </FormItem>

        <Button type="submit">
          {isCreatingPresignedUrls
            ? "Creating..."
            : isUploadingToS3
            ? "Uploading..."
            : isPersistingData
            ? "Persisting Data"
            : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

export default UploadForm;
