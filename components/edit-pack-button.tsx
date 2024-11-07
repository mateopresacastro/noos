"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function EditPackButton({ userName }: { userName: string }) {
  const user = useUser();
  const isOwner = userName === user.user?.username;

  console.log("isOwner", { isOwner, userName, user });
  return isOwner ? (
    <Button className="font-medium" variant="secondary" size="lg">
      Edit
    </Button>
  ) : null;
}
