"use client";

import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

export default function Clerk() {
  return (
    <>
      <SignedOut>
        <div className="flex justify-around items-center gap-4">
          <SignInButton>
            <Button size="sm" variant="secondary" className="font-medium">
              Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button size="sm" className="font-medium">
              Sign up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton userProfileMode="navigation" userProfileUrl="/dashboard" />
      </SignedIn>
    </>
  );
}
