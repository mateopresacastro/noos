import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen md:py-24 flex items-center justify-center">
      <Loader className="size-10 text-neutral-700 animate-spin" />
    </div>
  );
}
