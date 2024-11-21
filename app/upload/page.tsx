import UploadForm from "@/components/upload-form";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UploadPage() {
  const userData = await currentUser();

  if (!userData || !userData.username) {
    notFound();
  }

  return <UploadForm />;
}
