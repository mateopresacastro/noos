import sgMail from "@sendgrid/mail";
import { headers } from "next/headers";
import { createSamplePackDownloadUrl } from "@/lib/aws/mod";
import { getCustomerData, stripe } from "@/lib/stripe";
import { sendTelegramMessage } from "@/lib/telegram";
import { STRIPE_WEBHOOK_SECRET } from "@/cfg";
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

  if (!customerData || !customerData.email || !customerData.name) {
    throw new Error("Customer data not found");
  }

  const { email, name } = customerData;
  const downloadUrl = await createSamplePackDownloadUrl(metadata.s3Key);
  if (!downloadUrl) throw new Error("Error creating download url");
  await sendEmail(email, name, downloadUrl);
  await sendTelegramMessage(`${name} (${email}) just purchased a sample pack!`);
}

async function sendEmail(email: string, name: string, downloadUrl: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SENDGRID_API_KEY not set, skipping email");
    return;
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // TODO: improve email. Short link.
  const msg = {
    to: email,
    from: "mateopresacastro@gmail.com",
    subject: "Your sample pack is ready!",
    text: `Hey ${name}, your sample pack is ready to download at ${downloadUrl}`,
    html: `<p>Hey ${name}, your sample pack is ready to download at ${downloadUrl}</p>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Sendgrid response:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    await sendTelegramMessage(
      ` ⚠️ Error sending email with link to ${email}, ${name}, download url:${downloadUrl}`
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
      console.warn("Missing stripe-signature header");
      throw new Error("missing stripe-signature header");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        console.info("Handling successful payment intent");
        await sendTelegramMessage("Handling successful payment intent!");
        await handleSuccessfulPaymentIntent(event);
        break;
      }
      default: {
        console.warn("Unhandled event type:", { type: event.type });
      }
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error handling Stripe webhook:", { error });
    const message = error instanceof Error ? error.message : "Unknown error";
    await sendTelegramMessage(` ⚠️ Error handling Stripe webhook: ${message}`);
    return new Response(null, { status: 400 });
  }
}
