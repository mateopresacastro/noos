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
import { createSamplePackName, isDev } from "@/lib/utils";
import {
  type UploadFormSchema,
  uploadFormSchema,
} from "@/components/upload-form-schema";

type PreSignedUrls = Awaited<ReturnType<typeof handleCreatePreSignedUrl>>;

const defaultValues = {
  title: "",
  description: "",
  price: 0,
};

export default function UploadForm() {
  const form = useForm<UploadFormSchema>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues,
  });

  const formValues = form.getValues();

  const {
    mutate: createPreSignedUrls,
    data: preSignedUrls,
    isPending: isCreatingPresignedUrls,
  } = useMutation({
    mutationFn: async () =>
      await handleCreatePreSignedUrl(formValues.samples.length),
    onSuccess: createSignedUrlsOnSuccess,
  });

  const { mutate: uploadToS3, isPending: isUploadingToS3 } = useMutation({
    mutationFn: async (data: UploadToS3Data) => await handleUploadToS3(data),
    onSuccess: () => persistData(),
  });

  function createSignedUrlsOnSuccess(preSignedUrls: PreSignedUrls) {
    const { zipFileSignedUrl, imageSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    return uploadToS3({
      zipFileSignedUrl: zipFileSignedUrl.url,
      zipFile: formValues.zipFile[0],
      imageSignedUrl: imageSignedUrl.url,
      image: formValues.img[0],
      samplesSignedUrls: samplesSignedUrls.map(({ url }) => url),
      samples: formValues.samples,
    });
  }

  const { mutate: persistData, isPending: isPersistingData } = useMutation({
    mutationFn: async () => {
      const data = getDataToPersist();
      if (!data) throw new Error();
      await handlePersistData(data);
    },
  });

  function getDataToPersist() {
    if (!preSignedUrls) return;
    const { description, price, title } = formValues;
    const { imageSignedUrl, zipFileSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    const name = createSamplePackName(title);
    const imgUrl = createPublicUrl(imageSignedUrl.key, "public");
    const url = createPublicUrl(zipFileSignedUrl.key, "public");
    const samples = samplesSignedUrls.map(({ key }) => ({
      url: createPublicUrl(key, "public"),
    }));
    return {
      samplePack: {
        price,
        title,
        description,
        name,
        imgUrl,
        url,
      },
      samples,
    };
  }

  const imgRef = form.register("img");
  const zipRef = form.register("zipFile");
  const samplesRef = form.register("samples");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => createPreSignedUrls())}
        className="space-y-14 w-full pt-8 overflow-y-scroll px-1"
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
            ? "Persisting Data..."
            : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

function createPublicUrl(key: string, visibility: "private" | "public") {
  if (isDev) {
    if (
      !process.env.NEXT_PUBLIC_AWS_PRIVATE_BUCKET_NAME ||
      !process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_NAME
    ) {
      throw new Error("AWS bucket names not set");
    }
    const bucketName =
      visibility === "private"
        ? process.env.NEXT_PUBLIC_AWS_PRIVATE_BUCKET_NAME
        : process.env.NEXT_PUBLIC_AWS_PUBLIC_BUCKET_NAME;
    return `https://localhost.localstack.cloud:4566/${bucketName}/${key}`;
  }

  // TODO: Handle prod url
  return "";
}
