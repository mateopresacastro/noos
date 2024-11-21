import Link from "next/link";
import Clerk from "@/components/clerk";

export default function Header() {
  return (
    <header className="fixed w-full max-w-7xl inset-0 px-2 mx-auto h-fit flex items-center justify-center z-50">
      <div className="flex items-center justify-between py-4 border bg-neutral-900/50 border-neutral-800 rounded-lg px-5 w-full mt-2 backdrop-blur-lg">
        <div className="flex items-baseline justify-center space-x-10 text-sm tracking-wide">
          <Link href="/" prefetch={true}>
            <h1 className="text-xl tracking-normal">
              noos
              <span className="text-neutral-300 text-xs font-mono pl-2">
                alpha
              </span>
            </h1>
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
