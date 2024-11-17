"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboardIcon, SquareArrowOutUpRight } from "lucide-react";
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
          <UserButton.UserProfilePage label="security" />
          <UserButton.UserProfileLink
            label="Dashboard"
            url="/dashboard"
            labelIcon={<LayoutDashboardIcon className="w-4 h-4" />}
          />
          {username ? (
            <UserButton.UserProfileLink
              label="Your store"
              url={`/${username}`}
              labelIcon={<SquareArrowOutUpRight className="w-4 h-4" />}
            />
          ) : null}
        </UserButton>
      </SignedIn>
    </>
  );
}
