import { Badge } from "@/components/ui/badge";
import { hasRequirementsDueAction } from "@/lib/actions";

export default async function StripeAccountStatus() {
  const requirements = await hasRequirementsDueAction();

  return requirements ? (
    <Badge variant="warn">Not ready</Badge>
  ) : (
    <Badge variant="success">Ready</Badge>
  );
}
