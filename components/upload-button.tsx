"use client";

import UploadForm from "@/components/upload-form";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";

export default function UploadButton({ userName }: { userName: string }) {
  const currentUserData = useUser();
  const isOwner = userName === currentUserData?.user?.username;

  return isOwner ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4">Upload</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95dvh] max-w-2xl overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Upload a Sample Pack</DialogTitle>
          <DialogDescription>
            Fill the information. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UploadForm />
      </DialogContent>
    </Dialog>
  ) : null;
}
