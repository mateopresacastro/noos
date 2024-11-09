import "server-only";
import Stripe from "stripe";
import { getSamplePack } from "@/lib/db/queries";
import { HOST_URL, STRIPE_SECRET_KEY } from "@/cfg";
import { v4 as uuidv4 } from "uuid";

export const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createPaymentLink(
  priceId: string,
  stripeConnectedAccountId: string,
  userName: string
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
        after_completion: {
          type: "redirect",
          redirect: { url: `${HOST_URL}/payment-success/${userName}` },
        },
      },
      {
        stripeAccount: stripeConnectedAccountId,
        idempotencyKey: uuidv4(),
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
    const { url } = await stripe.accountLinks.create(
      {
        account: stripeId,
        refresh_url: `${HOST_URL}`, // TODO: redirect url
        return_url: `${HOST_URL}`,
        type: "account_onboarding",
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    return url;
  } catch (error) {
    console.error("Error creating onboarding link", error);
    return null;
  }
}

export async function createConnectedAccount(clerkId: string) {
  try {
    const account = await stripe.accounts.create(
      {
        metadata: { clerkId },
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    return account.id;
  } catch (error) {
    console.error("Error creating connected account:", error);
    return null;
  }
}

type Product = {
  title: string;
  description?: string;
  clerkId: string;
  price: number;
  imgUrl: string;
  userName: string;
  samplePackName: string;
  stripeConnectedAccountId: string;
};

export async function createProduct({
  title,
  description,
  clerkId,
  price,
  imgUrl,
  userName,
  samplePackName,
  stripeConnectedAccountId,
}: Product) {
  try {
    const product = await stripe.products.create(
      {
        name: title,
        description,
        metadata: { ownerClerkId: clerkId },
        default_price_data: {
          currency: "usd",
          unit_amount: price * 100,
        },
        images: [imgUrl],
        shippable: false,
        url: `${HOST_URL}/${userName}/${samplePackName}`,
      },
      {
        stripeAccount: stripeConnectedAccountId,
        idempotencyKey: uuidv4(),
      }
    );

    const { default_price: priceId } = product;
    if (!priceId) throw new Error("Default priceId not found");
    if (typeof priceId !== "string") {
      throw new Error("Default price is not an id");
    }

    return { product, priceId };
  } catch (error) {
    console.error("Error creating product:", {
      error,
      title,
      description,
      clerkId,
      price,
      imgUrl,
      userName,
      samplePackName,
      stripeConnectedAccountId,
    });

    return null;
  }
}

export async function getProduct(productId: string) {
  try {
    const product = await stripe.products.retrieve(
      productId,
      {
        expand: ["default_price"],
      },
      { idempotencyKey: uuidv4() }
    );

    if (!product) {
      throw new Error("Product not found or default price not found");
    }

    const { default_price: price } = product;
    if (!price) throw new Error("Default price not found");
    if (typeof price === "string") {
      throw new Error("Default price is not an object");
    }

    return { product, price };
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}

type UpdateProductData = {
  title: string;
  description?: string;
  price: number;
  imgUrl?: string;
  userName: string;
  samplePackName: string;
  stripeConnectedAccountId: string;
  clerkId: string;
};

export async function updateProduct({
  title,
  description,
  price,
  userName,
  samplePackName,
  stripeConnectedAccountId,
  clerkId,
}: UpdateProductData) {
  try {
    const currentSamplePack = await getSamplePack({ userName, samplePackName });
    if (!currentSamplePack) throw new Error("Sample pack not found");
    const { stripeProductId } = currentSamplePack;
    const productUpdateData: Stripe.ProductUpdateParams = {
      description,
      name: title,
      metadata: { ownerClerkId: clerkId },
      url: `${HOST_URL}/${userName}/${samplePackName}`,
    };

    const stripeOptions = {
      stripeAccount: stripeConnectedAccountId,
      idempotencyKey: uuidv4(),
    };

    let newPaymentLink;
    // Create new price if price has changed
    if (currentSamplePack.price !== price) {
      const newPrice = await createPrice({
        price,
        stripeProductId,
        stripeConnectedAccountId,
      });

      if (!newPrice) throw new Error("Error creating price");
      newPaymentLink = await createPaymentLink(
        newPrice.id,
        stripeConnectedAccountId,
        userName
      );

      if (!newPaymentLink) throw new Error("Error creating payment link");
      productUpdateData.default_price = newPrice.id;
    }

    const product = await stripe.products.update(
      stripeProductId,
      productUpdateData,
      stripeOptions
    );

    return { product, newPaymentLink };
  } catch (error) {
    console.error("Error updating product", error);
    return null;
  }
}

async function createPrice({
  price,
  stripeProductId,
  stripeConnectedAccountId,
}: {
  price: number;
  stripeProductId: string;
  stripeConnectedAccountId: string;
}) {
  try {
    return await stripe.prices.create(
      {
        unit_amount: price * 100,
        currency: "usd",
        product: stripeProductId,
      },
      {
        stripeAccount: stripeConnectedAccountId,
        idempotencyKey: uuidv4(),
      }
    );
  } catch (error) {
    console.error("Error creating price", error);
    return null;
  }
}

export async function getCustomerData(
  paymentIntentId: string,
  stripeConnectedAccountId: string
) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["charges.data", "latest_charge"],
      },
      {
        stripeAccount: stripeConnectedAccountId,
      }
    );

    if (!paymentIntent) {
      throw new Error("Payment intent not found");
    }

    if (!paymentIntent.latest_charge) {
      throw new Error("No charge found");
    }

    if (typeof paymentIntent.latest_charge === "string") {
      throw new Error("Charge is not an object");
    }

    return { ...paymentIntent.latest_charge.billing_details };
  } catch (error) {
    console.error(
      "Error retrieving payment intent:",
      error,
      paymentIntentId,
      stripeConnectedAccountId
    );
    return null;
  }
}
