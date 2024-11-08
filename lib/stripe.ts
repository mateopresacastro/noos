"use server";

import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { HOST_URL, STRIPE_SECRET_KEY } from "@/cfg";
import { readUser } from "@/lib/db/queries/mod";
import "server-only";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createConnectedAccountAction(clerkId: string) {
  try {
    const account = await stripe.accounts.create({
      metadata: { clerkId },
    });

    return account.id;
  } catch (error) {
    console.error("Error creating connected account:", error);
    return null;
  }
}

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
