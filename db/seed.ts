import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imgUrl =
  "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJvREhnRTdsdnVGQ09aRmN3R3lLWXZXaThqcyJ9";

await prisma.sample.deleteMany();
await prisma.samplePack.deleteMany();
await prisma.user.deleteMany();

const user1 = await prisma.user.create({
  data: {
    clerkId: "user_1",
    email: "user1@example.com",
    userName: "producer1",
    imgUrl: imgUrl,
    name: "Producer One",
    samplePacks: {
      create: [
        {
          title: "Drum Kit Essentials",
          description: "Essential drum sounds for any genre",
          price: 19.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `Drum ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
        {
          title: "Synth Wave Collection",
          description: "Retro synth sounds from the 80s",
          price: 24.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `Synth ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
        {
          title: "Bass Loops Pro",
          description: "Professional bass loops for producers",
          price: 29.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `Bass ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
      ],
    },
  },
});

const user2 = await prisma.user.create({
  data: {
    clerkId: "user_2",
    email: "user2@example.com",
    userName: "producer2",
    imgUrl: imgUrl,
    name: "Producer Two",
    samplePacks: {
      create: [
        {
          title: "Vocal Chops Deluxe",
          description: "Premium vocal samples and chops",
          price: 34.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `Vocal ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
        {
          title: "Guitar Riffs Collection",
          description: "Rock and metal guitar riffs",
          price: 27.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `Guitar ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
        {
          title: "FX Arsenal",
          description: "Sound effects and transitions",
          price: 22.99,
          imgUrl,
          samples: {
            create: Array(7)
              .fill(null)
              .map((_, i) => ({
                title: `FX ${i + 1}`,
                url: imgUrl,
              })),
          },
        },
      ],
    },
  },
});

await prisma.$disconnect();
