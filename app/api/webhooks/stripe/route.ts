import { STRIPE_WEBHOOK_SECRET } from "@/cfg";
import { createSamplePackDownloadUrl } from "@/lib/aws/mod";
import { getCustomerData, stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import sgMail from "@sendgrid/mail";
import type Stripe from "stripe";

async function handleSuccessfulPaymentIntent(
  event: Stripe.PaymentIntentSucceededEvent
) {
  console.log("Handling successful payment intent:", event);
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

  if (!customerData || !customerData.email || !customerData.name) {
    throw new Error("Customer data not found");
  }

  const { email, name } = customerData;
  const downloadUrl = await createSamplePackDownloadUrl(metadata.s3Key);
  if (!downloadUrl) throw new Error("Error creating download url");

  // TODO: send email
  await sendEmail(email, name, downloadUrl);
  console.log("Successful payment intent:", {
    paymentIntentId,
    connectedAccountId,
    email,
    name,
    s3Key: metadata.s3Key,
    downloadUrl,
  });
}

async function sendEmail(email: string, name: string, downloadUrl: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not set, skipping email");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "mateopresacastro@gmail.com",
    subject: "Your sample pack is ready!",
    text: `Your sample pack is ready to download at ${downloadUrl}`,
    html: `<p>Your sample pack is ready to download at ${downloadUrl}</p>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Sendgrid response:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    // TODO handle error
  }
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
