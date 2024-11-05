"use client";

import SamplePacks from "@/app/_header/sample-packs";
import Stripe from "@/app/_header/stripe";
import { Button } from "@/components/ui/button";
import { DollarSign, DotIcon, Music2 } from "lucide-react";
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
  const username = data?.user?.username;
  
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
          <UserButton.UserProfilePage label="account" />
          {username ? (
            <UserButton.UserProfileLink
              label="Public profile"
              url={`/${username}`}
              labelIcon={<DotIcon className="w-4 h-4" />}
            />
          ) : null}
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
          <UserButton.UserProfilePage label="security" />
        </UserButton>
      </SignedIn>
    </>
  );
}
