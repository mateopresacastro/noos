"use client";

import { md5 } from "@/app/upload/md5";

export type UploadToS3Data = {
  zipFileSignedUrl: string;
  zipFile: File;
  imageSignedUrl: string;
  image: File;
  samplesSignedUrls: string[];
  samples: {
    file: File;
    generatedName: string;
  }[];
};

export async function handleUploadToS3({
  zipFileSignedUrl,
  zipFile,
  imageSignedUrl,
  image,
  samplesSignedUrls,
  samples,
}: UploadToS3Data) {
  try {
    const zipPromise = uploadFile(zipFileSignedUrl, zipFile);
    const imgPromise = uploadFile(imageSignedUrl, image);
    const promises = [zipPromise, imgPromise];
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i].file;
      const sampleUrl = samplesSignedUrls[i];
      promises.push(uploadFile(sampleUrl, sample));
    }

    await Promise.all(promises);
  } catch {
    throw new Error();
  }
}

async function uploadFile(url: string, file: File) {
  const hash = await md5(file);
  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
      "Content-MD5": hash,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file to ${url}`);
  }
}
