"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import PriceNumber from "@/components/price-number";
import { motion } from "motion/react";
import { container, item } from "@/lib/anim";

type Option = {
  title: string;
  price: number;
  subtitle: string;
  bullets: string[];
  highlighted: boolean;
};

const OPTIONS: Option[] = [
  {
    title: "The One",
    price: 1.5,
    subtitle: "No recurring fees",
    bullets: [
      "Up to 50GB of storage",
      "5GB per pack",
      "20MB per sample preview",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center h-screen will-change-transform"
    >
      <div className="flex flex-col items-center justify-start">
        <motion.h4
          variants={item}
          className="text-5xl tracking-tight self-center"
        >
          Pricing
        </motion.h4>
        <motion.div
          variants={item}
          className="pt-6 w-96 text-center text-lg text-neutral-400 pb-14 md:max-w-xl md:w-full"
        >
          <span className="text-neutral-50">Don&apos;t pay a subscription</span>{" "}
          We charge a simple $1.50 per transaction, plus standard Stripe
          processing fees.
        </motion.div>
        <motion.div
          variants={item}
          className="gap-10 pb-32 flex flex-grow flex-wrap justify-center items-center will-change-transform"
        >
          {OPTIONS.map((option) => (
            <Option option={option} key={option.title} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function Option({
  option: { highlighted, price, subtitle, title, bullets },
}: {
  option: Option;
}) {
  return (
    <div
      className={cn(
        "w-96 border border-neutral-800 p-6 text-neutral-400 rounded-2xl bg-neutral-900 md:w-80",
        highlighted && "bg-gradient-to-b from-neutral-600 to-neutral-800"
      )}
    >
      <div className="text-neutral-50">{title}</div>
      <div
        className={cn(
          "pt-1 text-lg font-bold text-neutral-400 flex items-baseline",
          highlighted && "text-neutral-200"
        )}
      >
        <PriceNumber price={price} />
        <span className="pl-1">per transaction</span>
      </div>
      <div className={cn("text-sm py-6", highlighted && "text-neutral-200")}>
        {subtitle}
      </div>
      <Separator className={cn(highlighted && "dark:bg-neutral-500")} />
      {bullets.map((bullet) => (
        <div
          key={bullet}
          className={cn(
            "flex items-baseline text-sm space-y-6",
            highlighted && "text-neutral-200"
          )}
        >
          <Check
            className={cn(
              "size-3 text-neutral-500",
              highlighted && "text-neutral-200"
            )}
          />
          <p className="pl-3">{bullet}</p>
        </div>
      ))}
      <Link href="/sign-up" className="mt-12">
        <Button className="mt-12">Get started</Button>
      </Link>
    </div>
  );
}
