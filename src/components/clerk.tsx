"use client";

import Image from "next/image";
import Link from "next/link";
import { resize } from "@/utils";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  useUser,
  useClerk,
} from "@clerk/nextjs";

export default function Clerk() {
  const { user } = useUser();
  const clerk = useClerk();
  let userName: string;
  let imageUrl: string;

  if (user && user.username) {
    userName = user.username;
    imageUrl = resize(user.imageUrl ?? "");
  }

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
          <Link href="/upload" prefetch={true} className="hidden sm:block">
            <Button size="sm" className="font-bold">
              Upload
            </Button>
          </Link>
          <Link
            href="/dashboard/general"
            prefetch={true}
            className="hidden sm:block"
          >
            <Button size="sm" className="font-bold" variant="secondary">
              Dashboard
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Image
                src={imageUrl!}
                alt={userName!}
                width={50}
                height={50}
                className="rounded-full object-cover size-7 hover:opacity-80 transition-opacity duration-150 active:opacity-60"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 sm:mt-2 rounded-xl mr-2">
              <Link href={`/${userName!}`} prefetch={true}>
                <DropdownMenuItem className="text-sm rounded-lg cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link
                href="/dashboard/general"
                prefetch={true}
                className="block sm:hidden"
              >
                <DropdownMenuItem className="text-sm rounded-lg cursor-pointer">
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/upload" prefetch={true} className="block sm:hidden">
                <DropdownMenuItem className="text-sm rounded-lg cursor-pointer">
                  Upload
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="text-sm rounded-lg cursor-pointer"
                onClick={() => clerk.signOut()}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SignedIn>
    </>
  );
}
