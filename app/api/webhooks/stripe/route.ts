import { STRIPE_WEBHOOK_SECRET } from "@/cfg";
import { createSamplePackDownloadUrl } from "@/lib/aws/mod";
import { getCustomerData, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

async function handleSuccessfulPaymentIntent(
  event: Stripe.PaymentIntentSucceededEvent
) {
  const metadata = event.data.object.metadata;
  if (!metadata || !metadata.s3Key) {
    throw new Error("Metadata not found. Cannot retrieve sample pack");
  }
  const paymentIntentId = event.data.object.id;
  const connectedAccountId = event.account;
  if (!paymentIntentId || !connectedAccountId) {
    throw new Error("Payment intent or connected account not found");
  }

  const customerData = await getCustomerData(
    paymentIntentId,
    connectedAccountId
  );

  if (!customerData) throw new Error("Payment intent not found");
  const { email, name } = customerData;

  const downloadUrl = await createSamplePackDownloadUrl(metadata.s3Key);

  if (!downloadUrl) throw new Error("Error creating download url");

  // TODO: send email
  console.log("Successful payment intent:", {
    paymentIntentId,
    connectedAccountId,
    email,
    name,
    s3Key: metadata.s3Key,
    downloadUrl,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      throw new Error("missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        handleSuccessfulPaymentIntent(event);
        break;
      }
      default: {
        console.warn("Unhandled event type:", event.type);
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return new Response(null, { status: 400 });
  }
}