import sgMail from "@sendgrid/mail";
import log from "@/log";
import { headers } from "next/headers";
import { createSamplePackDownloadUrl } from "@/aws/mod";
import { getCustomerData, stripe } from "@/stripe";
import { STRIPE_WEBHOOK_SECRET } from "@/cfg";
import type Stripe from "stripe";
import { increaseTimesSold } from "@/db/mod";

async function handleSuccessfulPaymentIntent(
  event: Stripe.PaymentIntentSucceededEvent
) {
  const isRealTransaction = event.livemode === true;
  if (!isRealTransaction) await log.info("Processing test webhook");
  const metadata = event.data.object.metadata;
  if (!metadata || !metadata.s3Key || !metadata.stripeProductId) {
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

  if (!customerData || !customerData.email || !customerData.name) {
    throw new Error("Customer data not found");
  }

  const { email, name } = customerData;
  const downloadUrl = await createSamplePackDownloadUrl(metadata.s3Key);
  if (!downloadUrl) throw new Error("Error creating download url");

  if (isRealTransaction) {
    await sendEmail(email, name, downloadUrl);
  } else {
    await log.warn("Test webhook, skipping sending email", {
      email,
      name,
      downloadUrl,
    });
  }
  await increaseTimesSold(metadata.stripeProductId);

  if (isRealTransaction) {
    await log.info(`${name} (${email}) just purchased a sample pack!`);
  }
}

async function sendEmail(email: string, name: string, downloadUrl: string) {
  if (!process.env.SENDGRID_API_KEY) {
    await log.warn("SENDGRID_API_KEY not set, skipping email");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "mateopresacastro@gmail.com",
    subject: "Your sample pack is ready!",
    text: `Hey ${name}, your sample pack is ready to download at ${downloadUrl}`,
    html: `<p>Hey ${name}, your sample pack is ready to download at ${downloadUrl}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    await log.error(
      `Error sending email with link to ${email}, ${name}, download url:${downloadUrl}`,
      error
    );
    throw error;
  }
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
    await log.error("Error handling Stripe webhook:", { error });
    return new Response(null, { status: 400 });
  }
}
