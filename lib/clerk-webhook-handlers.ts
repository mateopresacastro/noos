import "server-only";

import type { UserJSON, DeletedObjectJSON } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/db/queries/mod";
import { createConnectedAccount } from "@/lib/stripe/mod";

export async function handleCreateUser(user: UserJSON) {
  const stripeId = await createConnectedAccount(user.id);
  if (!stripeId) {
    console.error("Error creating connected account");
    return null;
  }

  const newUser = await createUser({
    ...clean(user),
    stripeId,
  });

  return newUser;
}

export async function handleUpdateUser(user: UserJSON) {
  return updateUser(clean(user));
}

export async function handleDeleteUser(deletedObject: DeletedObjectJSON) {
  if (!deletedObject.id) {
    console.warn("Deleted object id is missing, skipping user deletion");
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

export const clientErrorResponse = new Response(null, { status: 400 });
export const serverErrorResponse = new Response(null, { status: 500 });
