import { createUser, deleteUser, updateUser } from "@/db/mod";
import type { UserJSON, DeletedObjectJSON } from "@clerk/nextjs/server";

export async function handleCreateUser(user: UserJSON) {
  return createUser({
    clerkId: user.id,
    name: user.first_name ?? "",
    email: user.email_addresses[0].email_address,
    userName: user.username ?? "",
    imgUrl: user.image_url ?? "",
  });
}

export async function handleUpdateUser(user: UserJSON) {
  return updateUser({
    clerkId: user.id,
    name: user.first_name ?? "",
    email: user.email_addresses[0].email_address,
    userName: user.username ?? "",
    imgUrl: user.image_url ?? "",
  });
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
