"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function UploadButton({ userName }: { userName: string }) {
  const currentUserData = useUser();
  const isOwner = userName === currentUserData?.user?.username;

  return isOwner ? (
    <Link href="/upload" className="mt-6" prefetch>
      <Button>Upload</Button>
    </Link>
  ) : null;
}
