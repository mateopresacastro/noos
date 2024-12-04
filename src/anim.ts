export const container = {
  show: {
    transition: {
      staggerChildren: 0.08,
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
      duration: 0.6,
      filter: {
        bounce: 0,
      },
    },
  },
};
