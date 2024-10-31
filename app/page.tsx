import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start min-h-screen py-2">
      <h2 className="text-6xl tracking-tight pt-24 text-center pb-6 sm:text-left sm:max-w-4xl sm:pt-36">
        Earn money with your sample library
      </h2>
      <span className="block text-neutral-300 pb-8 text-xl">
        noos is a marketplace for music creators.
      </span>
      <Link href="/sign-up">
        <Button>Start Selling</Button>
      </Link>
    </div>
  );
}
