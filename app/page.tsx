import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h2 className="text-9xl tracking-tighter">noos</h2>
      <span className="block text-neutral-400 pb-4">
        The marketplace for samplemakers
      </span>
      <Link href="/sign-up">
        <Button className="font-semibold">Start Selling</Button>
      </Link>
    </div>
  );
}
