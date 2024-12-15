import log from "@/log";
import { headers } from "next/headers";
import { createSamplePackDownloadUrl } from "@/aws/mod";
import { getCustomerData, stripe } from "@/stripe";
import { STRIPE_WEBHOOK_SECRET } from "@/cfg";
import { increaseTimesSold } from "@/db/mod";
import {
  notifySale,
  sendEmailToCustomer,
} from "@/app/api/webhooks/stripe/emails";

import type Stripe from "stripe";

async function handleSuccessfulPaymentIntent(
  event: Stripe.PaymentIntentSucceededEvent
) {
  const isRealTransaction = event.livemode === true;
  if (!isRealTransaction) {
    await log.info("Processing test webhook");
  }

  const metadata = event.data.object.metadata;
  if (
    !metadata ||
    !metadata.s3Key ||
    !metadata.stripeProductId ||
    !metadata.ownerUserName ||
    !metadata.ownerEmail
  ) {
    throw new Error("Metadata is not complete");
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

  if (!customerData || !customerData.email || !customerData.name) {
    throw new Error("Customer data not found");
  }

  const downloadUrl = await createSamplePackDownloadUrl(metadata.s3Key);
  if (!downloadUrl) throw new Error("Error creating download url");

  await Promise.all([
    sendEmailToCustomer(customerData.email, customerData.name, downloadUrl),
    notifySale(metadata.ownerEmail),
    increaseTimesSold(metadata.stripeProductId),
    log.info(
      `${customerData.name} (${customerData.email}) just purchased a sample pack from ${metadata.ownerUserName}!`
    ),
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get("stripe-signature");

    if (!signature) {
      await log.warn("Missing stripe-signature header");
      throw new Error("missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        await handleSuccessfulPaymentIntent(event);
        break;
      }
      default: {
        await log.warn("Unhandled event type:", { type: event.type });
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    await log.error("Error handling Stripe webhook:", {
      error: error instanceof Error ? error.message : error,
    });
    return new Response(null, { status: 400 });
  }
}
