import { hasRequirementsDue, createStripeAccountLink } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Stripe() {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <h4 className="font-bold">Stripe</h4>
      <Separator className="my-4 text-neutral-200" />
      <div className="flex items-center justify-between w-full">
        <StripeAccountStatus />
      </div>
    </div>
  );
}

function StripeAccountStatus() {
  const { data: requirements, isLoading } = useQuery({
    queryKey: ["stripeRequirements"],
    queryFn: hasRequirementsDue,
  });

  const { data: stripeAccountLink, refetch: getStripeAccountLink } = useQuery({
    queryKey: ["stripeAccountLink"],
    queryFn: createStripeAccountLink,
    enabled: false,
  });

  if (stripeAccountLink) {
    redirect(stripeAccountLink);
  }

  return (
    <div className="flex items-start justify-between flex-col w-full">
      <div className="flex items-center gap-3 pb-3">
        <span className="text-sm">Account status:</span>
        {isLoading ? (
          <Badge variant="outline">Loading</Badge>
        ) : requirements ? (
          <Badge variant="warn">Not ready</Badge>
        ) : (
          <Badge>Ready</Badge>
        )}
      </div>
      {requirements ? (
        <Button size="sm" onClick={async () => await getStripeAccountLink()}>
          Finish setup
        </Button>
      ) : null}
    </div>
  );
}
