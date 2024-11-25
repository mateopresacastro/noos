import Link from "next/link";
import Clerk from "@/components/clerk";

export default function Header() {
  return (
    <header className="fixed w-full max-w-[160rem] inset-0 mx-auto h-fit flex items-center justify-center z-50">
      <div className="flex items-center justify-between py-6 rounded-xl w-full backdrop-blur-3xl px-6 lg:px-10 2xl:px-16 bg-neutral-950/80 ">
        <div className="flex items-baseline justify-center space-x-10 text-sm tracking-wide">
          <Link href="/" prefetch={true}>
            <h1 className="text-xl tracking-normal">
              noos
              <span className="text-neutral-300 text-xs font-mono pl-2">
                alpha
              </span>
            </h1>
          </Link>
          <Link href="/pricing" prefetch={true} className="hidden sm:block">
            <span className="text-neutral-300">Pricing</span>
          </Link>
        </div>
        <Clerk />
      </div>
    </header>
  );
}
