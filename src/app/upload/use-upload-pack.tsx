"use client";

import { UploadToS3Data, handleUploadToS3 } from "@/app/upload/upload";
import { createSamplePackName, getAudioDuration, isDev } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import {
  createPreSignedUrlAction,
  persistSamplePackDataAction,
  updateUserUsedStorageAction,
} from "@/actions";

import type { UploadFormSchema } from "@/app/upload/upload-form-schema";
import { md5 } from "@/app/upload/md5";

type PreSignedUrls = Awaited<ReturnType<typeof createPreSignedUrlAction>>;

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
    mutationFn: async () => {
      const [imageHash, zipHash, ...samplesHashes] = await Promise.all([
        md5(formValues.zipFile),
        md5(formValues.img),
        ...formValues.samples.map((sample) => md5(sample.file)),
      ]);

      const data = {
        img: { hash: imageHash, fileType: formValues.img.type },
        zip: { hash: zipHash, fileType: formValues.zipFile.type },
        samples: samplesHashes.map((hash, index) => ({
          hash,
          fileType: formValues.samples[index].file.type,
        })),
      };

      return await createPreSignedUrlAction(data);
    },
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
      const data = await getDataToPersist();
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
      const { img, zipFile, samples, title } = formValues;
      const samplesSizeInBytes = samples.reduce(
        (acc, { file }) => acc + file.size,
        0
      );

      const newFileSizeInBytes = BigInt(
        img.size + zipFile.size + samplesSizeInBytes
      );

      await updateUserUsedStorageAction({
        newFileSizeInBytes,
        samplePackName: createSamplePackName(title),
      });
    },
  });

  async function getDataToPersist() {
    if (!preSignedUrls) return;
    const { description, price, title, samples: formSamples } = formValues;
    const { imageSignedUrl, zipFileSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    const name = createSamplePackName(title);
    const imgUrl = createPublicUrl(imageSignedUrl.key);
    const url = createPublicUrl(zipFileSignedUrl.key);

    const samples = await Promise.all(
      samplesSignedUrls.map(async ({ key }, index) => {
        const url = createPublicUrl(key);
        const sample = formSamples.at(index);
        if (!sample) throw new Error("Sample not found");
        return {
          url,
          duration: await getAudioDuration(url),
          name: sample.generatedName,
        };
      })
    );

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
