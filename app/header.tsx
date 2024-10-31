"use client";

import SamplePacks from "@/components/profile/sample-packs";
import Stripe from "@/components/profile/stripe";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Music2, DollarSign } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed w-full max-w-7xl inset-0 px-6 mx-auto h-fit">
      <div className="flex items-center justify-between py-6">
        <div className="flex items-baseline gap-6">
          <Link href="/">
            <h1 className="text-2xl tracking-tight">noos</h1>
          </Link>
          <Link href="/explore">
            <span className="text-neutral-400">Explore</span>
          </Link>
          <Link href="/pricing">
            <span className="text-neutral-400">Pricing</span>
          </Link>
        </div>
        <SignedOut>
          <SignInButton>
            <Button size="sm" className="font-semibold">
              Sign in
            </Button>
          </SignInButton>
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
