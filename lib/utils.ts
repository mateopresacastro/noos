import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = process.env.NODE_ENV === "development";
export const isTest = process.env.NODE_ENV === "test";

export function createSamplePackName(str: string) {
  return encodeURIComponent(
    str
      .split(" ")
      .map((word) =>
        word
          .split("")
          .map((char) => char.toLowerCase())
          .join("")
      )
      .join("-")
  );
}

export function urlNameToTitle(str: string): string {
  return decodeURIComponent(
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase().concat(word.slice(1)))
      .join(" ")
  );
}

export function formatTime(duration: number): string {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
