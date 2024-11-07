import Link from "next/link";
import Clerk from "@/components/clerk";

export default function Header() {
  return (
    <header className="fixed w-full max-w-6xl inset-0 px-6 mx-auto h-fit flex items-center justify-center">
      <div className="flex items-center justify-between py-2 border bg-neutral-900/50 border-neutral-800 rounded-xl px-5 w-full mt-3 backdrop-blur-lg">
        <div className="flex items-center justify-center space-x-10 text-sm tracking-wide">
          <Link href="/" prefetch={true}>
            <h1 className="text-xl tracking-normal">noos</h1>
          </Link>
          <Link href="/explore" prefetch={true}>
            <span className="text-neutral-300">Explore</span>
          </Link>
          <Link href="/pricing" prefetch={true}>
            <span className="text-neutral-300">Pricing</span>
          </Link>
        </div>
        <Clerk />
      </div>
    </header>
  );
}
