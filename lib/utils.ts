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

export function resize(imgUrl: string) {
  const searchParams = new URLSearchParams();
  searchParams.set("height", "50");
  searchParams.set("width", "50");
  searchParams.set("quality", "75");
  searchParams.set("fit", "crop");
  return `${imgUrl}?${searchParams.toString()}`;
}
