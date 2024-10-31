import { createUser, deleteUser, updateUser } from "@/lib/db/mod";
import type { UserJSON, DeletedObjectJSON } from "@clerk/nextjs/server";

export async function handleCreateUser(user: UserJSON) {
  return createUser({
    clerkId: user.id,
    name: user.first_name ?? "",
    email: user.email_addresses[0].email_address,
  });
}

export async function handleUpdateUser(user: UserJSON) {
  return updateUser({
    clerkId: user.id,
    name: user.first_name ?? "",
    email: user.email_addresses[0].email_address,
  });
}

export async function handleDeleteUser(deletedObject: DeletedObjectJSON) {
  if (!deletedObject.id) {
    console.error("Error deleting user: id is missing");
    return null;
  }

  return deleteUser({
    clerkId: deletedObject.id,
  });
}
