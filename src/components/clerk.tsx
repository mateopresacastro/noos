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
import { useRouter } from "next/navigation";

export default function Clerk() {
  const { user } = useUser();
  const router = useRouter();
  const clerk = useClerk();
  let userName: string;
  let imageUrl: string;

  if (user && user.username) {
    userName = user.username;
    imageUrl = resize(user.imageUrl ?? "");
    router.prefetch(`/${userName}`);
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
          <Link href="/upload" prefetch={true}>
            <Button size="sm" className="font-bold">
              Upload
            </Button>
          </Link>
          <Link href="/dashboard/general" prefetch={true}>
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
            <DropdownMenuContent className="dark:bg-neutral-900 mt-2 rounded-xl">
              <DropdownMenuItem
                className="text-sm rounded-lg cursor-pointer"
                onClick={() => router.push(`/${userName}`)}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm rounded-lg cursor-pointer"
                onClick={() => clerk.signOut()}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SignedIn>
    </>
  );
}
