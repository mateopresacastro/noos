import { STRIPE_SECRET_KEY } from "@/cfg";
import Stripe from "stripe";

export const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createConnectedAccount(clerkId: string) {
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
