import CountryForm from "@/app/country/form";
import { doesUserHaveStripeAccount } from "@/db/mod";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const userData = await currentUser();
  if (!userData || !userData.username) notFound();
  const userHasStripeAccount = await doesUserHaveStripeAccount(
    userData.username
  );

  if (userHasStripeAccount) redirect("/dashboard/onboarding");

  return <CountryForm />;
}
