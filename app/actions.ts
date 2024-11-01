"use server";
import "server-only";

import { readUser } from "@/db/mod";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createStripeAccountLink() {
  const user = await currentUser();
  if (!user) throw new Error();
  const data = await readUser({ clerkId: user.id });
  if (!data || !data.stripeId) throw new Error();
  const { url } = await stripe.accountLinks.create({
    account: data.stripeId,
    // TODO add proper host redirect url
    refresh_url: `http://localhost:3000/refresh/${user.username}`,
    return_url: `http://localhost:3000/return/${user.username}`,
    type: "account_onboarding",
  });

  return url;
}
