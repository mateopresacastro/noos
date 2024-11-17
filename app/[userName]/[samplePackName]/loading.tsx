import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Fade from "@/components/fade";
import { FaPlay } from "react-icons/fa";
import { LoaderIcon } from "lucide-react";

// TODO responsive skeleton
export default async function Page() {
  return (
    <>
      <div className="flex items-start justify-center min-h-screen py-24 pb-40">
        <div className="flex items-start flex-col w-full">
          <div className="w-full flex flex-col sm:flex-row">
            <div className="w-64 flex items-center justify-center self-center">
              <div className="w-full h-full aspect-square mb-4 object-cover relative">
                <Skeleton className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-between items-end pb-2 w-full">
              <div className="sm:pl-5 flex flex-col items-start">
                <Skeleton className="w-40 h-6 font-bold sm:h-10 sm:w-48 " />
                <div className="flex items-center justify-center py-1 pb-2">
                  <Skeleton className="w-5 h-5 rounded-full mr-2" />
                  <Skeleton className="w-20 h-3 sm:h-4" />
                </div>
                <Skeleton className="w-full h-3 mb-2" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full pt-4 sm:justify-start">
            <Button className="font-medium text-base px-10">
              <LoaderIcon className="animate-spin" />
            </Button>
            <Skeleton className="ml-5 w-20 hidden sm:block h-7" />
          </div>
          <div className="mt-10 w-full hidden sm:block">
            <span className="ml-14 text-neutral-400 mb-3 text-sm">Title</span>
            <Separator className="mb-3 mt-2" />
          </div>
          <div className="w-full flex flex-col pt-10 sm:pt-0">
            {[1, 2, 3].map((n) => (
              <SampleSkeleton key={n} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SampleSkeleton() {
  return (
    <div className="flex w-[100%+6rem] cursor-pointer items-center justify-between rounded-lg transition-colors duration-150 ease-in-out hover:bg-neutral-900 h-16 pl-3 -ml-3 sm:-ml-0">
      <div className="flex items-center justify-start">
        <div className="flex items-baseline justify-start w-5 sm:w-10 sm:pl-2 text-neutral-600 hover:scale-110 active:scale-100 active:text-neutral-300 hover:text-neutral-50 transition-all duration-150">
          <Fade id="play">
            <FaPlay size={12} />
          </Fade>
        </div>
        <div>
          <Skeleton className="w-32 h-4 mb-3" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
    </div>
  );
}
