import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Samples() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <h4 className="font-bold">Sample packs</h4>
      <Separator className="my-4 text-neutral-200" />
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">Upload</span>
        <Button size="sm">Upload Sample Pack</Button>
      </div>
    </div>
  );
}
