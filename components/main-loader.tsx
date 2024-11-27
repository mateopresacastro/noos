"use client";

import { Loader } from "lucide-react";
import { motion } from "motion/react";

export default function MainLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center h-screen will-change-transform">
      <motion.div
        initial={{ opacity: 0, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
      >
        <Loader className="animate-spin text-neutral-600" />
      </motion.div>
    </div>
  );
}
