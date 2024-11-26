import log from "@/lib/log";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { CLERK_WEBHOOK_SECRET } from "@/cfg";
import { createUser, deleteUser, updateUser } from "@/lib/db/mod";
import type {
  WebhookEvent,
  UserJSON,
  DeletedObjectJSON,
} from "@clerk/nextjs/server";

async function handleCreateUser(user: UserJSON) {
  const newUser = await createUser({
    ...clean(user),
  });

  return newUser;
}

async function handleUpdateUser(user: UserJSON) {
  return updateUser(clean(user));
}

async function handleDeleteUser(deletedObject: DeletedObjectJSON) {
  if (!deletedObject.id) {
    await log.warn("Deleted object id is missing, skipping user deletion");
    return null;
  }

  return deleteUser(deletedObject.id);
}

function clean(user: UserJSON) {
  return {
    clerkId: user.id,
    name: user.first_name ?? "",
    email: user.email_addresses[0].email_address,
    userName: user.username ?? "",
    imgUrl: user.image_url ?? "",
  };
}

const clientErrorResponse = new Response(null, { status: 400 });
const serverErrorResponse = new Response(null, { status: 500 });

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
        await log.error("Error creating user");
        return serverErrorResponse;
      }
      await log.info("New user created", { userName: newUser?.userName });
    }

    if (evt.type === "user.updated") {
      const user = await handleUpdateUser(evt.data);
      if (!user) {
        await log.error("Error updating user");
        return serverErrorResponse;
      }
    }

    if (evt.type === "user.deleted") {
      const user = await handleDeleteUser(evt.data);
      await log.error("Error deleting user");
      if (!user) {
        return serverErrorResponse;
      }
    }

    return new Response(null, { status: 200 });
  } catch {
    await log.warn("Clerk Webhook failed");
    return clientErrorResponse;
  }
}
