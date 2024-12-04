import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <span className="block text-xl pb-3">Payment successful!</span>
      <p className="pb-3 text-neutral-400">
        We will send you an email with the download link. It is available for 1
        hour.
      </p>
      <Link href="/" prefetch={true}>
        <Button>Go to home</Button>
      </Link>
    </div>
  );
}
