"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { container, item } from "@/anim";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center sm:items-start justify-start h-screen my-50 will-change-transform mt-32 max-w-4xl mx-auto"
    >
      <motion.h2
        variants={item}
        className="tracking-tight text-center sm:text-start pb-6 sm:max-w-4xl uppercase text-neutral-400"
      >
        Sample pack selling
      </motion.h2>
      <motion.h2
        variants={item}
        className="text-6xl tracking-tight text-center sm:text-start pb-8 sm:max-w-4xl"
      >
        Set up your sample pack store in minutes
      </motion.h2>
      <motion.span
        variants={item}
        className="block text-neutral-200 pb-10 text-3xl text-center sm:text-start "
      >
        Unlike Shopify, noos is built for producers.
      </motion.span>
      <motion.ul className="flex flex-col gap-4 text-center sm:text-start items-start pb-10">
        <motion.li
          variants={item}
          className=" text-neutral-300 text-lg text-center flex items-center gap-2"
        >
          <Check />
          No monthly fees
        </motion.li>
        <motion.li
          variants={item}
          className=" text-neutral-300 text-lg text-center flex items-center gap-2"
        >
          <Check />
          Up to 50GB of storage
        </motion.li>
        <motion.li
          variants={item}
          className=" text-neutral-300 text-lg text-center flex items-center gap-2"
        >
          <Check />
          Beautiful music player
        </motion.li>
      </motion.ul>

      <motion.div variants={item}>
        <Link href="/sign-up" prefetch={true}>
          <Button className="py-6">Start Selling</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
