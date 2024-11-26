export const container = {
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.4,
    },
  },
};

export const item = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(3px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      duration: 1.2,
      filter: {
        bounce: 0,
      },
    },
  },
};
