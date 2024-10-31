"use client";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="fixed w-full max-w-7xl inset-0 px-6 mx-auto">
      <div className="flex items-center justify-between py-6">
        <h1>noos</h1>
        <SignedOut>
          <SignInButton>
            <Button size="sm" className="font-semibold text-">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
