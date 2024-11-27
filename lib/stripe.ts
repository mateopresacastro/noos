import "server-only";
import Stripe from "stripe";
import { getSamplePack, readUser } from "@/lib/db/mod";
import { HOST_URL, STRIPE_SECRET_KEY } from "@/lib/cfg";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";
import log from "@/lib/log";

export const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function createPaymentLink({
  priceId,
  stripeConnectedAccountId,
  userName,
  productId,
  key,
}: {
  priceId: string;
  stripeConnectedAccountId: string;
  userName: string;
  productId: string;
  key?: string;
}) {
  try {
    const metadata: {
      ownerUserName: string;
      productId: string;
      s3Key?: string;
    } = {
      ownerUserName: userName,
      productId,
    };

    // To not reset it when updating the pack
    if (key) metadata.s3Key = key;

    const { url } = await stripe.paymentLinks.create(
      {
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        payment_intent_data: {
          metadata,
        },
        application_fee_amount: 150,
        after_completion: {
          type: "redirect",
          redirect: { url: `${HOST_URL}/payment-success` },
        },
      },
      {
        stripeAccount: stripeConnectedAccountId,
        idempotencyKey: uuidv4(),
      }
    );

    if (!url) throw new Error("Error creating payment link");

    await log.info("Created payment link", {
      url,
      priceId,
      stripeConnectedAccountId,
      userName,
      key,
    });

    return url;
  } catch (error) {
    await log.error("Error creating payment link", error);
    return null;
  }
}

type CreateConnectedAccount = {
  clerkId: string;
  country: string;
};

export async function createConnectedAccount({
  clerkId,
  country,
}: CreateConnectedAccount) {
  try {
    const account = await stripe.accounts.create(
      {
        metadata: { clerkId },
        controller: {
          stripe_dashboard: {
            type: "none",
          },
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        country,
        business_profile: {
          support_url: `https://noos-three.vercel.app`, // TODO handle this url properly. Real URL to avoid stripe errors
          url: `https://noos-three.vercel.app`,
          mcc: "5815", // digital goods (music)
          product_description: "Sample Packs",
        },
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    await log.info("Created connected account", { account, clerkId, country });
    return account.id;
  } catch (error) {
    await log.error("Error creating connected account:", error);
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
  key: string;
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
  key,
}: Product) {
  try {
    const product = await stripe.products.create(
      {
        name: title,
        description,
        metadata: { ownerClerkId: clerkId, s3Key: key },
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
    await log.error("Error creating product:", {
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
    await log.error("Error retrieving product:", error);
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
    // Create new price and payment link if the price has changed
    if (currentSamplePack.price !== price) {
      const newPrice = await createPrice({
        price,
        stripeProductId,
        stripeConnectedAccountId,
      });

      if (!newPrice) throw new Error("Error creating price");
      newPaymentLink = await createPaymentLink({
        priceId: newPrice.id,
        productId: stripeProductId,
        stripeConnectedAccountId,
        userName,
      });

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
    await log.error("Error updating product", error);
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
    await log.error("Error creating price", error);
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
    await log.error("Error retrieving payment intent:", {
      error,
      paymentIntentId,
      stripeConnectedAccountId,
    });
    return null;
  }
}

export async function createAccountSession(account: string) {
  try {
    const session = await stripe.accountSessions.create({
      account,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
        payments: {
          enabled: true,
          features: {
            capture_payments: true,
            refund_management: true,
            dispute_management: true,
            destination_on_behalf_of_charge_management: true,
          },
        },
        account_management: { enabled: true },
        notification_banner: { enabled: true },
        balances: { enabled: true },
        documents: { enabled: true },
        tax_settings: { enabled: true },
        tax_registrations: { enabled: true },
        payouts: { enabled: true },
        payouts_list: { enabled: true },
        payment_details: {
          enabled: true,
          features: {
            capture_payments: true,
            refund_management: true,
            dispute_management: true,
            destination_on_behalf_of_charge_management: true,
          },
        },
      },
    });

    return session.client_secret;
  } catch (error) {
    await log.error("Error creating account session", error);
    return null;
  }
}

export async function hasRequirementsDue() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("User not signed in");
    const data = await readUser(clerkId);
    if (!data || !data.stripeId) throw new Error("User not found");

    const { requirements } = await stripe.accounts.retrieve(data.stripeId);

    if (
      !requirements ||
      !requirements.currently_due ||
      requirements.currently_due.length === 0
    ) {
      return false;
    }

    return true;
  } catch (error) {
    await log.error("Error checking for requirements due", { error });
    return true;
  }
}
