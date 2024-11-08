import stripe from "@/lib/stripe/client";
import "server-only";

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
