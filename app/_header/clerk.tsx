"use client";

import SamplePacks from "@/app/_header/sample-packs";
import Stripe from "@/app/_header/stripe";
import { Button } from "@/components/ui/button";
import { DollarSign, Music2 } from "lucide-react";
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
        <UserButton>
          <UserButton.UserProfilePage
            label="Stripe"
            url="stripe"
            labelIcon={<DollarSign className="w-4 h-4" />}
          >
            <Stripe />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage
            label="Sample packs"
            url="sample-packs"
            labelIcon={<Music2 className="w-4 h-4" />}
          >
            <SamplePacks />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage label="account" />
          <UserButton.UserProfilePage label="security" />
        </UserButton>
      </SignedIn>
    </>
  );
}