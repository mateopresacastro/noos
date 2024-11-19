import { z } from "zod";

const ONE_GB_IN_BYTES = 1000 * 1024 * 1024;
const TEN_MB_IN_BYTES = 10 * 1024 * 1024;

const isFileList = (value: unknown): value is FileList => {
  return typeof window !== "undefined" && value instanceof FileList;
};

export const uploadFormSchema = z.object({
  title: z.string().min(5).max(35),
  description: z.string().min(5).max(20).optional(),
  price: z.number().min(0),
  img: z
    .custom<FileList>((value) => isFileList(value), "Must be a FileList")
    .refine((files) => files.length === 1, "Select one image")
    .refine(
      (files) => files[0]?.size <= TEN_MB_IN_BYTES,
      "Image must be less than 10MB"
    )
    .refine(
      (files) => files[0]?.type.startsWith("image/"),
      "File must be an image"
    ),
  zipFile: z
    .custom<FileList>((value) => isFileList(value), "Must be a FileList")
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
    .custom<FileList>((value) => isFileList(value), "Must be a FileList")
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
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= TEN_MB_IN_BYTES),
      "Each sample file must be less than 10MB"
    ),
});

export type UploadFormSchema = z.infer<typeof uploadFormSchema>;
