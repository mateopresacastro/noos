"use client";

import { motion } from "framer-motion";

export default function Fade({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(1.5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(1.5px)" }}
      transition={{ duration: 0.15 }}
      key={id}
    >
      {children}
    </motion.div>
  );
}
