"use client";

import UploadForm from "@/app/_header/upload-form";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function UploadButton({ userName }: { userName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLFormElement>(null!);
  const currentUserData = useUser();
  const isOwner = userName === currentUserData?.user?.username;

  useOnClickOutside(ref, () => setIsModalOpen(false));

  return (
    <>
      {isOwner ? (
        <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
          Upload
        </Button>
      ) : null}
      {isModalOpen ? <UploadForm ref={ref} /> : null}
    </>
  );
}
