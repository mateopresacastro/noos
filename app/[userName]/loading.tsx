import { DotIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-24 sm:pt-32">
      <div className="rounded-full size-24 overflow-hidden">
        <Skeleton className="rounded-full object-cover h-24 w-24" />
      </div>
      <Skeleton className="block pt-6 text-xl font-medium w-24 h-4 mt-7 mb-2" />
      <div className="flex items-center justify-center pt-1">
        <Skeleton className="text-neutral-400 h-4 w-16 block text-sm font-medium" />
        <DotIcon className="text-neutral-600 size-4" />
        <Skeleton className="text-neutral-400 block text-sm font-medium  h-4 w-4 mr-1" />
        <Skeleton className="text-neutral-400 block text-sm font-medium  h-4 w-10" />
      </div>
      <SamplePacksSkeletons />
    </div>
  );
}

function SamplePacksSkeletons() {
  return (
    <div className="pt-10 sm:pt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-14 w-full mb-32 mx-auto">
      {[1, 2, 3, 4].map((num) => (
        <SamplePackSkeleton key={num} />
      ))}
    </div>
  );
}

function SamplePackSkeleton() {
  return (
    <div className="flex flex-col items-start justify-center rounded-2xl w-full aspect-square hover:opacity-80 transition-opacity duration-150 mb-2 active:opacity-60">
      <Skeleton className="rounded-2xl w-full h-full object-cover" />
      <div className="flex flex-col w-full gap-2 mt-2">
        <Skeleton className="text-neutral-400 block text-sm font-medium  h-4 w-20 " />
        <Skeleton className="text-neutral-400 block text-sm font-medium  h-4 w-14 mr-1" />
      </div>
    </div>
  );
}
