import { z } from "zod";

const FIVE_GB_IN_BYTES = 5000 * 1024 * 1024;
const TWENTY_MB_IN_BYTES = 20 * 1024 * 1024;
const TEN_MB_IN_BYTES = 10 * 1024 * 1024;
const MAX_NUM_OF_SAMPLES = 100;
const isFileList = (value: unknown): value is FileList => {
  return typeof window !== "undefined" && value instanceof FileList;
};

export type SampleFile = {
  file: File;
  generatedName: string;
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
      (files) => files[0]?.size <= FIVE_GB_IN_BYTES,
      "Zip must be less than 5GB"
    )
    .refine(
      (files) => files[0]?.type === "application/zip",
      "File must be in ZIP format"
    ),
  samples: z
    .array(
      z.object({
        file: z
          .custom<File>((value) => value instanceof File, "Must be a File")
          .refine(
            (file) => file.type.startsWith("audio/"),
            "File must be an audio file"
          )
          .refine(
            (file) => file.size <= TWENTY_MB_IN_BYTES,
            "File must be less than 20MB"
          ),
        generatedName: z
          .string()
          .max(20, "Name is too long")
          .min(1, "Name is required"),
      })
    )
    .min(1, "At least one sample is required")
    .max(MAX_NUM_OF_SAMPLES, `Maximum ${MAX_NUM_OF_SAMPLES} samples allowed`),
});

export type UploadFormSchema = z.infer<typeof uploadFormSchema>;
