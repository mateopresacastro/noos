import "server-only";

function clerkWebhookSecret(): string {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  return secret;
}

function stripeSecretKey(): string {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    throw new Error(
      "Please add STRIPE_SECRET_KEY from Stripe Dashboard to .env or .env.local"
    );
  }

  return secret;
}

export const CLERK_WEBHOOK_SECRET = clerkWebhookSecret();
export const STRIPE_SECRET_KEY = stripeSecretKey();
