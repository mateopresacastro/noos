"use client";

import { UploadToS3Data, handleUploadToS3 } from "@/lib/aws/upload";
import { createSamplePackName, isDev } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  createPreSignedUrlAction,
  persistSamplePackDataAction,
  updateUserUsedStorageAction,
} from "@/lib/actions";

import type { UploadFormSchema } from "@/components/upload-form-schema";

type PreSignedUrls = Awaited<ReturnType<typeof createPreSignedUrlAction>>;

// TODO: error handling
export function useUploadPack({
  formValues,
}: {
  formValues: UploadFormSchema;
}) {
  const {
    mutate: createPreSignedUrls,
    data: preSignedUrls,
    isPending: isCreatingPresignedUrls,
  } = useMutation({
    mutationFn: async () =>
      await createPreSignedUrlAction(formValues.samples?.length),
    onSuccess: createSignedUrlsOnSuccess,
  });

  function createSignedUrlsOnSuccess(preSignedUrls: PreSignedUrls) {
    const { zipFileSignedUrl, imageSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    return uploadToS3({
      zipFileSignedUrl: zipFileSignedUrl.url,
      zipFile: formValues.zipFile,
      imageSignedUrl: imageSignedUrl.url,
      image: formValues.img,
      samplesSignedUrls: samplesSignedUrls.map(({ url }) => url),
      samples: formValues.samples,
    });
  }

  const { mutate: uploadToS3, isPending: isUploadingToS3 } = useMutation({
    mutationFn: async (data: UploadToS3Data) => await handleUploadToS3(data),
    onSuccess: () => persistData(),
  });

  const {
    mutate: persistData,
    isPending: isPersistingData,
    isSuccess,
  } = useMutation({
    mutationFn: async () => {
      const data = getDataToPersist();
      if (!data) throw new Error();
      await persistSamplePackDataAction(data);
    },
    onSuccess: () => updateUserUsedStorage(),
  });

  const {
    mutate: updateUserUsedStorage,
    isSuccess: updatedUserStorageSuccess,
    isPending: updatedUserStoragePending,
  } = useMutation({
    mutationFn: async () => {
      const { img, zipFile, samples } = formValues;
      const samplesSizeInBytes = samples.reduce(
        (acc, { file }) => acc + file.size,
        0
      );

      const newFileSizeInBytes = BigInt(
        img.size + zipFile.size + samplesSizeInBytes
      );

      await updateUserUsedStorageAction({ newFileSizeInBytes });
    },
  });

  function getDataToPersist() {
    if (!preSignedUrls) return;
    const { description, price, title, samples: formSamples } = formValues;
    const { imageSignedUrl, zipFileSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    const name = createSamplePackName(title);
    const imgUrl = createPublicUrl(imageSignedUrl.key);
    const url = createPublicUrl(zipFileSignedUrl.key);
    const samples = samplesSignedUrls.map(({ key }, index) => ({
      url: createPublicUrl(key),
      name: formSamples.at(index)?.generatedName ?? "Unknown name (fix me)",
    }));
    return {
      samplePack: {
        price,
        title,
        description,
        name,
        imgUrl,
        url,
        key: zipFileSignedUrl.key,
      },
      samples,
    };
  }

  return {
    handleUpload: createPreSignedUrls,
    isCreatingPresignedUrls,
    uploadToS3,
    isUploadingToS3,
    persistData,
    isPersistingData,
    isLoading:
      isCreatingPresignedUrls ||
      isUploadingToS3 ||
      isPersistingData ||
      updatedUserStoragePending,
    isSuccess: isSuccess && updatedUserStorageSuccess,
  };
}

function createPublicUrl(key: string) {
  if (isDev) {
    return `https://localhost.localstack.cloud:4566/noos-public-assets-v2/${key}`;
  }

  return `https://d14g83wf83qv4z.cloudfront.net/${key}`;
}
