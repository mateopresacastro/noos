import { Webhook } from "svix";
import { headers } from "next/headers";
import { CLERK_WEBHOOK_SECRET } from "@/cfg";
import type { WebhookEvent } from "@clerk/nextjs/server";
import {
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUser,
  clientErrorResponse,
  serverErrorResponse,
} from "@/controllers/mod";

export async function POST(req: Request) {
  try {
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return clientErrorResponse;
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;

    if (evt.type === "user.created") {
      const newUser = await handleCreateUser(evt.data);
      if (!newUser) {
        return serverErrorResponse;
      }
    }

    if (evt.type === "user.updated") {
      const user = await handleUpdateUser(evt.data);
      if (!user) {
        return serverErrorResponse;
      }
    }

    if (evt.type === "user.deleted") {
      const user = await handleDeleteUser(evt.data);
      if (!user) {
        return serverErrorResponse;
      }
    }

    return new Response(null, { status: 200 });
  } catch {
    return clientErrorResponse;
  }
}
