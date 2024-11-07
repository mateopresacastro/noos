import { z } from "zod";

const ONE_GB_IN_BYTES = 1000 * 1024 * 1024;
const FIVE_MB_IN_BYTES = 5 * 1024 * 1024;

export const uploadFormSchema = z.object({
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
