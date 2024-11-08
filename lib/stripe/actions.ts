"use server";

import stripe from "@/lib/stripe/client";
import { currentUser } from "@clerk/nextjs/server";
import { HOST_URL } from "@/cfg";
import { readUser } from "@/lib/db/queries/mod";
import "server-only";


export async function createStripeAccountLinkAction() {
  const user = await currentUser();
  if (!user) throw new Error();
  const data = await readUser({ clerkId: user.id });
  if (!data || !data.stripeId) throw new Error();
  const { url } = await stripe.accountLinks.create({
    account: data.stripeId,
    refresh_url: `${HOST_URL}/dashboard/stripe`,
    return_url: `${HOST_URL}/dashboard/stripe`,
    type: "account_onboarding",
  });

  return url;
}

export async function hasRequirementsDueAction() {
  const user = await currentUser();
  if (!user) throw new Error();
  const data = await readUser({ clerkId: user.id });
  if (!data || !data.stripeId) throw new Error();
  const { requirements } = await stripe.accounts.retrieve(data.stripeId);

  // TODO check for future due requirements
  if (
    !requirements ||
    !requirements.currently_due ||
    requirements.currently_due.length === 0
  ) {
    return false;
  }

  return true;
}
