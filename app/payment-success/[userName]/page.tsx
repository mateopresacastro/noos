import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PaymentSuccess({
  params,
}: {
  params: Promise<{ userName: string }>;
}) {
  const userName = (await params).userName;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <span className="block text-xl pb-3">Payment successful!</span>
      <p className="pb-3">
        We will send you an email with the download link. It is available for 1
        hour.
      </p>
      <Link href={`/${userName}`} prefetch={true}>
        <Button>Go back to store</Button>
      </Link>
    </div>
  );
}
