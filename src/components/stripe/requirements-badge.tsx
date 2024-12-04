import { Badge } from "@/components/ui/badge";
import { hasRequirementsDue } from "@/stripe";

export default async function StripeRequirementsBadge() {
  const hasRequirements = await hasRequirementsDue();
  return hasRequirements ? (
    <Badge variant="warn">Not ready</Badge>
  ) : (
    <Badge variant="success">Done</Badge>
  );
}
