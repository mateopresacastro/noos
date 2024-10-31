"use client";

import SamplePacks from "@/components/profile/sample-packs";
import Stripe from "@/components/profile/stripe";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Music2, DollarSign } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed w-full max-w-7xl inset-0 px-6 mx-auto h-fit flex items-center justify-center">
      <div className="flex items-center justify-between py-2 border border-neutral-800/50 rounded-2xl px-5 w-full mt-3 backdrop-blur-lg">
        <div className="flex items-center justify-center space-x-6 text-sm tracking-wide">
          <Link href="/">
            <h1 className="text-xl tracking-normal">noos</h1>
          </Link>
          <Link href="/explore">
            <span className="text-neutral-300">Explore</span>
          </Link>
          <Link href="/pricing">
            <span className="text-neutral-300">Pricing</span>
          </Link>
        </div>
        <SignedOut>
          <div className="flex justify-around items-center gap-4">
            <SignInButton>
              <Button size="sm" variant="secondary" className="font-medium">
                Log in
              </Button>
            </SignInButton>
            <SignInButton>
              <Button size="sm" className="font-medium">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton>
            <UserButton.UserProfilePage
              label="Sample packs"
              url="sample-packs"
              labelIcon={<Music2 className="w-4 h-4" />}
            >
              <SamplePacks />
            </UserButton.UserProfilePage>
            <UserButton.UserProfilePage
              label="Stripe"
              url="stripe"
              labelIcon={<DollarSign className="w-4 h-4" />}
            >
              <Stripe />
            </UserButton.UserProfilePage>
            <UserButton.UserProfilePage label="account" />
            <UserButton.UserProfilePage label="security" />
          </UserButton>
        </SignedIn>
      </div>
    </header>
  );
}
