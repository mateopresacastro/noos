import { createStripeAccountLink } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Stripe() {
  const { data: stripeAccountLink, refetch } = useQuery({
    queryKey: ["stripeAccountLink"],
    queryFn: createStripeAccountLink,
    enabled: false,
  });

  if (stripeAccountLink) {
    redirect(stripeAccountLink);
  }

  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <h4 className="font-bold">Stripe</h4>
      <Separator className="my-4 text-neutral-200" />
      <div className="flex items-center justify-between w-full">
        <span className="text-xs">Setup Stripe</span>
        <Button size="sm" onClick={async () => await refetch()}>
          Setup Stripe
        </Button>
      </div>
    </div>
  );
}
