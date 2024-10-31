import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const user1 = await prisma.user.create({
  data: {
    email: "user1@example.com",
    name: "User One",
  },
});

const user2 = await prisma.user.create({
  data: {
    email: "user2@example.com",
    name: "User Two",
  },
});

// Create sample packs
const samplePack1 = await prisma.samplePack.create({
  data: {
    title: "Sample Pack 1",
    description: "This is the first sample pack.",
    price: 19.99,
    creator: {
      connect: { id: user1.id },
    },
  },
});

const samplePack2 = await prisma.samplePack.create({
  data: {
    title: "Sample Pack 2",
    description: "This is the second sample pack.",
    price: 29.99,
    creator: {
      connect: { id: user2.id },
    },
  },
});

console.log({ user1, user2, samplePack1, samplePack2 });

await prisma.$disconnect();
