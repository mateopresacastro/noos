import { z } from "zod";
import {
  TEN_MB_IN_BYTES,
  FIVE_GB_IN_BYTES,
  TWENTY_MB_IN_BYTES,
  MAX_NUM_OF_SAMPLES,
} from "@/consts";

export type SampleFile = {
  file: File;
  generatedName: string;
};

export const uploadFormSchema = z.object({
  title: z.string().min(5).max(35),
  description: z.string().min(5).max(200).optional(),
  price: z.coerce
    .number({
      invalid_type_error: "Price must be a valid number.",
      required_error: "Price is required.",
    })
    .min(5, { message: "Price must be at least 5." }),
  img: z
    .custom<File>((value) => value instanceof File, "Must be a file")
    .refine(
      (file) => file.size <= TEN_MB_IN_BYTES,
      "Image must be less than 10MB"
    )
    .refine((file) => file.type.startsWith("image/"), "File must be an image"),
  zipFile: z
    .custom<File>((value) => value instanceof File, "Must be a file")
    .refine(
      (file) => file.size <= FIVE_GB_IN_BYTES,
      "Zip must be less than 5GB"
    )
    .refine(
      (file) => file.type === "application/zip",
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
