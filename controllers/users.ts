import "server-only";
import { createUser, deleteUser, updateUser } from "@/db/mod";
import { createConnectedAccount } from "@/lib/stripe";
import type { UserJSON, DeletedObjectJSON } from "@clerk/nextjs/server";

export async function handleCreateUser(user: UserJSON) {
  const stripeId = await createConnectedAccount(user.id);
  if (!stripeId) {
    console.warn("Creating account without stripe id");
  }

  const newUser = await createUser({
    ...clean(user),
    stripeId: stripeId ?? "",
  });

  if (!newUser && stripeId) {
    console.warn(
      `A stripe connected account (${stripeId}) was created but the user creation failed (${user.username}).`
    );
  }

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

  return deleteUser({
    clerkId: deletedObject.id,
  });
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
