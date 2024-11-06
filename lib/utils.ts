import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export function createSamplePackName(str: string) {
  return str
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((char) => char.toLowerCase())
        .join("")
    )
    .join("-");
}
