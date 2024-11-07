"use client";

import Stripe from "@/components/stripe";
import { Button } from "@/components/ui/button";
import { DollarSign, SquareArrowOutUpRight } from "lucide-react";
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
              labelIcon={<SquareArrowOutUpRight className="w-4 h-4" />}
            />
          ) : null}
          <UserButton.UserProfilePage
            label="Stripe"
            url="stripe"
            labelIcon={<DollarSign className="w-4 h-4" />}
          >
            <Stripe />
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage label="security" />
        </UserButton>
      </SignedIn>
    </>
  );
}
