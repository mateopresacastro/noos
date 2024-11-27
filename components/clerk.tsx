"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  useUser,
} from "@clerk/nextjs";
import { resize } from "@/lib/utils";

export default function Clerk() {
  const { user } = useUser();
  let userName;
  let imageUrl;

  if (user) {
    userName = user.username;
    imageUrl = resize(user.imageUrl ?? "");
  }

  return (
    <>
      <SignedOut>
        <div className="flex justify-around items-center gap-4">
          <SignInButton>
            <Button size="sm" variant="secondary" className="font-bold">
              Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm" className="font-bold">
              Sign up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="w-fit flex items-center gap-3 lg:gap-4">
          <Link href="/upload" prefetch>
            <Button size="sm" className="font-bold">
              Upload
            </Button>
          </Link>
          <Link href="/dashboard/payments" prefetch>
            <Button size="sm" className="font-bold" variant="secondary">
              Dashboard
            </Button>
          </Link>
          <Link href={`/${userName}`} prefetch>
            <Image
              src={imageUrl!}
              alt={userName!}
              width={50}
              height={50}
              className="rounded-full object-cover size-7 hover:opacity-80 transition-opacity duration-150 active:opacity-60"
            />
          </Link>
        </div>
      </SignedIn>
    </>
  );
}
