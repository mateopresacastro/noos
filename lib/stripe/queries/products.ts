import "server-only";
import stripe from "@/lib/stripe/client";
import { HOST_URL } from "@/cfg";
import { v4 as uuidv4 } from "uuid";
import { getSamplePack } from "@/lib/db/queries/mod";
import { createPaymentLink } from "@/lib/stripe/queries/mod";
import type Stripe from "stripe";

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

    if (!product) throw new Error("The call to create a product failed");
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
    const product = await stripe.products.retrieve(productId, {
      expand: ["default_price"],
    });

    if (!product) {
      throw new Error("Product not found or default price not found");
    }

    const { default_price: price } = product;
    if (!price) throw new Error("Default price not found");
    if (typeof price === "string") {
      throw new Error(" Default price is not an object");
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
  imgUrl,
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
      const newPrice = await stripe.prices.create(
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

      newPaymentLink = await createPaymentLink(
        newPrice.id,
        stripeConnectedAccountId
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
