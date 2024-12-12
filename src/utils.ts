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
      .trim()
      .split(" ")
      .filter((word) => word !== "" && word !== " ")
      .map((word) => word.toLowerCase())
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

export function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    const handleLoadedMetadata = () => {
      resolve(audio.duration);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };

    const handleError = () => {
      reject(new Error("Failed to load audio"));
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    try {
      audio.load();
    } catch (err) {
      reject(
        new Error(
          `Error loading audio: ${
            err instanceof Error ? err.message : String(err)
          }`
        )
      );
    }
  });
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(1, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}
