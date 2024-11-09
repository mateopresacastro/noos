"use server";

import "server-only";
import stripe from "@/lib/stripe/client";
import { auth } from "@clerk/nextjs/server";
import { readUser } from "@/lib/db/queries/mod";
import { createOnboardingLink } from "@/lib/stripe/queries/mod";

export async function createStripeAccountLinkAction() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    const data = await readUser(clerkId);
    if (!data || !data.stripeId) throw new Error("User not found");
    const url = await createOnboardingLink(data.stripeId);

    return url;
  } catch (error) {
    console.error("Error creating stripe account link", error);
    throw new Error();
  }
}

export async function hasRequirementsDueAction() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    const data = await readUser(clerkId);
    if (!data || !data.stripeId) throw new Error("User not found");
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
  } catch (error) {
    console.error("Error checking for requirements due", error);
    throw new Error();
  }
}
