import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen my-50">
      <h2 className="text-6xl tracking-tight text-center pb-6 sm:max-w-4xl">
        Make money with your sample library
      </h2>
      <span className="block text-neutral-300 pb-8 text-xl text-center">
        noos is a marketplace for music creators.
      </span>
      <Link href="/sign-up" prefetch={true}>
        <Button className="py-6">Start Selling</Button>
      </Link>
    </div>
  );
}
