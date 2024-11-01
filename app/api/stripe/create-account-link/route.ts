import {
  clientErrorResponse,
  serverErrorResponse,
} from "@/controllers/responses";
import { readUser } from "@/db/mod";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return clientErrorResponse;
    const data = await readUser({ clerkId: user.id });
    if (!data || !data.stripeId) return clientErrorResponse;

    const { url: createAccountLink } = await stripe.accountLinks.create({
      account: data.stripeId,
      // TODO add proper host redirect url
      refresh_url: `https://localhost:3000/refresh/${data.userName}`,
      return_url: `https://localhost:3000/return/${data.userName}`,
      type: "account_onboarding",
    });

    return new Response(JSON.stringify({ createAccountLink }), { status: 200 });
  } catch (error) {
    console.error("Error creating stripe account link:", error);
    return serverErrorResponse;
  }
}
