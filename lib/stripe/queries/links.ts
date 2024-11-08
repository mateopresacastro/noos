import "server-only";
import stripe from "@/lib/stripe/client";

export async function createPaymentLink(
  priceId: string,
  stripeConnectedAccountId: string
) {
  const { url } = await stripe.paymentLinks.create(
    {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      application_fee_amount: 300,
    },
    {
      stripeAccount: stripeConnectedAccountId,
    }
  );

  if (!url) throw new Error("Error creating payment link");

  return url;
}
