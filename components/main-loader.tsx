import { Loader } from "lucide-react";

export default function MainLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center h-screen">
      <Loader className="animate-spin text-neutral-600" />
    </div>
  );
}
