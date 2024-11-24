import UploadPage from "@/components/upload-page";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UploadPageRoot() {
  const userData = await currentUser();

  if (!userData || !userData.username) {
    notFound();
  }

  return <UploadPage userName={userData.username} />;
}
