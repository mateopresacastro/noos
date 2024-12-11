import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imgUrl =
  "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJvREhnRTdsdnVGQ09aRmN3R3lLWXZXaThqcyJ9";

const sampleUrl =
  "https://d14g83wf83qv4z.cloudfront.net/uploads/samples/767faad9b5a73d4efd34fc0aeb66f6c8";

try {
  await prisma.user.create({
    data: {
      clerkId: "user-1",
      email: process.env.CLERK_TEST_USER_EMAIL!,
      userName: process.env.CLERK_TEST_USERNAME!,
      imgUrl: imgUrl,
      name: "producer-1",
      samplePacks: {
        create: [
          {
            title: "sample-pack-1",
            description: "desc-1",
            price: 19.99,
            imgUrl,
            name: "sample-pack-1",
            url: "https://www.example.com/drum-kit-essentials",
            stripeProductId: "sample-pack-1",
            samples: {
              create: Array(7)
                .fill(null)
                .map((_, i) => ({
                  title: `title-${i + 1}`,
                  url: sampleUrl,
                  duration: i + 1,
                })),
            },
          },
          {
            title: "sample-pack-2",
            description: "desc-2",
            price: 19.99,
            imgUrl,
            name: "sample-pack-2",
            url: "https://www.example.com/drum-kit-essentials",
            stripeProductId: "sample-pack-2",
            samples: {
              create: Array(7)
                .fill(null)
                .map((_, i) => ({
                  title: `title2-${i + 1}`,
                  url: sampleUrl,
                })),
            },
          },
        ],
      },
    },
  });
} catch (error) {
  if (
    !(error instanceof Prisma.PrismaClientKnownRequestError) ||
    error.code !== "P2002"
  ) {
    throw error;
  }
  console.log("The database is already seeded.");
}

await prisma.$disconnect();
