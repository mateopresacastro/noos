import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-fit md:py-48 flex items-center justify-center">
      <Loader className="size-7 text-neutral-700 animate-spin" />
    </div>
  );
}
