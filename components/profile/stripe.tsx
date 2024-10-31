import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Stripe() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <h4 className="font-bold">Stripe</h4>
      <Separator className="my-4 text-neutral-200" />
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">Setup Stripe</span>
        <Button size="sm">Setup Stripe</Button>
      </div>
    </div>
  );
}
