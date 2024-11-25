"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Clerk() {
  const data = useUser();
  const userName = data?.user?.username;

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
          <UserButton>
            <UserButton.UserProfilePage label="account" />
            <UserButton.UserProfilePage label="security" />
            {userName ? (
              <UserButton.UserProfileLink
                label="Your store"
                url={`/${userName}`}
                labelIcon={<SquareArrowOutUpRight className="w-4 h-4" />}
              />
            ) : null}
          </UserButton>
        </div>
      </SignedIn>
    </>
  );
}
