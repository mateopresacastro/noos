"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadPack } from "@/hooks/upload-pack";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  uploadFormSchema,
  type UploadFormSchema,
} from "@/components/upload-form-schema";

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
  const imgRef = form.register("img");
  const zipRef = form.register("zipFile");
  const samplesRef = form.register("samples");

  const {
    handleUpload,
    isCreatingPresignedUrls,
    isUploadingToS3,
    isPersistingData,
  } = useUploadPack({ formValues });

  let previewImgUrl = "";
  if (formValues.img?.length > 0) {
    previewImgUrl = URL.createObjectURL(formValues.img[0]);
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 sm:pt-32">
      {previewImgUrl === "" ? null : (
        <Image src={previewImgUrl} alt="Preview" height={300} width={300} />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => handleUpload())}
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
    </div>
  );
}
