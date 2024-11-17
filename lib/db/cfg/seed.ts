import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imgUrl =
  "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJvREhnRTdsdnVGQ09aRmN3R3lLWXZXaThqcyJ9";

await prisma.sample.deleteMany();
await prisma.samplePack.deleteMany();
await prisma.user.deleteMany();

await prisma.user.create({
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
          name: "drum-kit-essentials",
          url: "https://www.example.com/drum-kit-essentials",
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
          name: "synth-wave-collection",
          url: "https://www.example.com/synth-wave-collection",
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
          name: "bass-loops-pro",
          url: "https://www.example.com/bass-loops-pro",
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

await prisma.user.create({
  data: {
    clerkId: "user_2",
    email: "user2@example.com",
    userName: "producer2",
    imgUrl: imgUrl,
    name: "Producer Two",
    samplePacks: {
      create: [
        {
          title: "Drum Kit Essentials",
          description: "Essential drum sounds for any genre",
          price: 19.99,
          imgUrl,
          name: "drum-kit-essentials",
          url: "https://www.example.com/drum-kit-essentials",
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
          name: "synth-wave-collection",
          url: "https://www.example.com/synth-wave-collection",
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
          name: "bass-loops-pro",
          url: "https://www.example.com/bass-loops-pro",
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

await prisma.$disconnect();
