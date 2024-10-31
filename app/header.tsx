"use client";
import Samples from "@/components/profile/sample-packs";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Music2 } from "lucide-react";

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
          <UserButton>
            <UserButton.UserProfilePage
              label="Sample packs"
              url="custom"
              labelIcon={<Music2 className="w-4 h-4" />}
            >
              <Samples />
            </UserButton.UserProfilePage>
            <UserButton.UserProfilePage label="account" />
            <UserButton.UserProfilePage label="security" />
          </UserButton>
        </SignedIn>
      </div>
    </header>
  );
}
