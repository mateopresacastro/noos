import "server-only";
import stripe from "@/lib/stripe/client";
import { HOST_URL } from "@/cfg";
import { v4 as uuidv4 } from "uuid";

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

    console.log("Created product:", product);
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

    if (!price) {
      throw new Error("Default price not found");
    }

    if (typeof price === "string") {
      throw new Error(" Default price is not an object");
    }

    return { product, price };
  } catch (error) {
    console.error("Error retrieving product:", error);
    return null;
  }
}
