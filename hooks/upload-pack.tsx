"use client";

import { UploadToS3Data, handleUploadToS3 } from "@/lib/aws/upload";
import { createSamplePackName, isDev } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import {
  createPreSignedUrlAction,
  persistSamplePackDataAction,
} from "@/lib/actions";

type PreSignedUrls = Awaited<ReturnType<typeof createPreSignedUrlAction>>;

export function useUploadPack({
  formValues,
}: {
  formValues: {
    samples: FileList;
    price: number;
    title: string;
    img: FileList;
    zipFile: FileList;
    description?: string | undefined;
  };
}) {
  const {
    mutate: createPreSignedUrls,
    data: preSignedUrls,
    isPending: isCreatingPresignedUrls,
  } = useMutation({
    mutationFn: async () =>
      await createPreSignedUrlAction(formValues.samples.length),
    onSuccess: createSignedUrlsOnSuccess,
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

  const { mutate: uploadToS3, isPending: isUploadingToS3 } = useMutation({
    mutationFn: async (data: UploadToS3Data) => await handleUploadToS3(data),
    onSuccess: () => persistData(),
  });

  const { mutate: persistData, isPending: isPersistingData } = useMutation({
    mutationFn: async () => {
      const data = getDataToPersist();
      if (!data) throw new Error();
      await persistSamplePackDataAction(data);
    },
  });

  function getDataToPersist() {
    if (!preSignedUrls) return;
    const { description, price, title } = formValues;
    const { imageSignedUrl, zipFileSignedUrl, samplesSignedUrls } =
      preSignedUrls;
    const name = createSamplePackName(title);
    const imgUrl = createPublicUrl(imageSignedUrl.key);
    const url = createPublicUrl(zipFileSignedUrl.key); // TODO we don't need this.
    const samples = samplesSignedUrls.map(({ key }) => ({
      url: createPublicUrl(key),
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
  };
}

function createPublicUrl(key: string) {
  if (isDev) {
    return `https://localhost.localstack.cloud:4566/noos-public-assets-v2/${key}`;
  }

  return `https://d14g83wf83qv4z.cloudfront.net/${key}`;
}
