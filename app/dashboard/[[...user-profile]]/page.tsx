"use client";

import SamplePacks from "@/app/dashboard/[[...user-profile]]/sample-packs";
import Stripe from "@/app/dashboard/[[...user-profile]]/stripe";
import { UserProfile } from "@clerk/nextjs";
import { DollarSign, Music2 } from "lucide-react";

export default function UserProfilePage() {
  return (
    <div className="h-screen flex flex-col items-center justify-start pt-24 sm:pt-36">
      <h4 className="text-5xl tracking-tight">Dashboard</h4>
      <p className="pt-6 w-96 text-center text-lg text-neutral-300 pb-14 md:max-w-xl md:w-full">
        Full control. From uploading new sample packs to payment history data.
      </p>
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full flex items-center justify-center w-full",
            cardBox: "w-full rounded-lg",
          },
        }}
      >
        <UserProfile.Page
          label="Stripe"
          url="stripe"
          labelIcon={<DollarSign className="w-4 h-4" />}
        >
          <Stripe />
        </UserProfile.Page>
        <UserProfile.Page
          label="Sample packs"
          url="sample-packs"
          labelIcon={<Music2 className="w-4 h-4" />}
        >
          <SamplePacks />
        </UserProfile.Page>
        <UserProfile.Page label="account" />
        <UserProfile.Page label="security" />
      </UserProfile>
    </div>
  );
}
