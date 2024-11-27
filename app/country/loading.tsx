import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader className="animate-spin text-neutral-400" />
    </div>
  );
}
