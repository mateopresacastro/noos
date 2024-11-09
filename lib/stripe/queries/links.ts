import "server-only";
import stripe from "@/lib/stripe/client";
import { HOST_URL } from "@/cfg";

export async function createPaymentLink(
  priceId: string,
  stripeConnectedAccountId: string
) {
  try {
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
  } catch (error) {
    console.error("Error creating payment link", error);
    return null;
  }
}

export async function createOnboardingLink(stripeId: string) {
  try {
    const { url } = await stripe.accountLinks.create({
      account: stripeId,
      refresh_url: `${HOST_URL}`, // TODO: redirect url
      return_url: `${HOST_URL}`,
      type: "account_onboarding",
    });

    return url;
  } catch (error) {
    console.error("Error creating onboarding link", error);
    return null;
  }
}
