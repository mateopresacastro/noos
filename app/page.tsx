"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { container, item } from "@/lib/anim";

export default function Home() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center h-screen my-50 will-change-transform"
    >
      <motion.h2
        variants={item}
        className="text-6xl tracking-tight text-center pb-6 sm:max-w-4xl"
      >
        Make money with your sample library
      </motion.h2>
      <motion.span
        variants={item}
        className="block text-neutral-300 pb-8 text-xl text-center"
      >
        noos is a marketplace for music creators.
      </motion.span>
      <motion.div variants={item}>
        <Link href="/sign-up" prefetch={true}>
          <Button className="py-6">Start Selling</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
