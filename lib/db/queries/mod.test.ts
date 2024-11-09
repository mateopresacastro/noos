import prisma from "@/lib/db/cfg/client";
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
  createSamplePack,
  deleteSamplePack,
  getSamplePack,
  updateSamplePack,
} from "@/lib/db/queries/mod";

describe("DB Queries", () => {
  const testUser = {
    clerkId: "test-clerk-id",
    name: "Test User",
    email: "testuser@example.com",
    userName: "testuser",
    imgUrl: "http://example.com/testuser.jpg",
  };

  afterAll(async () => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkId: testUser.clerkId,
        },
      });
      if (user) {
        const deletePack = prisma.samplePack.deleteMany({
          where: { creatorId: user.id },
        });
        const deleteUser = prisma.user.delete({
          where: {
            clerkId: testUser.clerkId,
          },
        });
        await prisma.$transaction([deletePack, deleteUser]);
        console.log("Test data deleted");
      }
    } catch (error) {
      console.error("Error deleting test data:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

  describe("User", () => {
    describe("Create", () => {
      it("should create a user", async () => {
        const user = await createUser(testUser);
        expect(user).toMatchObject(testUser);
        expect(user).toHaveProperty("id");
      });

      it("should return null if the user creation fails", async () => {
        const user = await createUser({
          clerkId: "another-clerk-id",
          name: "Another User",
          email: testUser.email, // Duplicate email should cause a failure
          userName: "anotheruser",
          imgUrl: "http://example.com/anotheruser.jpg",
        });
        expect(user).toBeNull();
      });

      it("should return null for invalid user data", async () => {
        const user = await createUser({
          clerkId: "",
          name: "",
          email: "testuser@example.com",
          userName: "testuser2",
          imgUrl: "http://example.com/testuser2.jpg",
        });
        expect(user).toBeNull();
      });
    });

    describe("Read", () => {
      it("should read a user", async () => {
        const user = await readUser(testUser.clerkId);
        expect(user).toMatchObject(testUser);
      });

      it("should return null for non-existent user", async () => {
        const user = await readUser("non-existent-clerk-id");
        expect(user).toBeNull();
      });
    });

    describe("Update", () => {
      it("should update a user", async () => {
        const updatedData = { ...testUser, name: "Updated User" };
        const updatedUser = await updateUser(updatedData);
        expect(updatedUser?.name).toBe("Updated User");
      });

      it("should return null for updating a non-existent user", async () => {
        const updatedUser = await updateUser({
          clerkId: "non-existent-clerk-id",
          name: "Updated User",
          email: "updated@example.com",
          userName: "updateduser",
          imgUrl: "http://example.com/updateduser.jpg",
        });
        expect(updatedUser).toBeNull();
      });
    });

    describe("Delete", () => {
      it("should delete a user", async () => {
        const deletedUser = await deleteUser(testUser.clerkId);
        expect(deletedUser?.clerkId).toBe(testUser.clerkId);
      });

      it("should return null for non existing user", async () => {
        const user = await readUser(testUser.clerkId);
        expect(user).toBeNull();
      });
    });
  });

  const samplePackData = {
    name: "test-sample-pack",
    description: "Test description",
    price: 100,
    imgUrl: "http://example.com/samplepack.jpg",
    title: "Test Sample Pack",
    url: "http://example.com/samplepack.zip",
    clerkId: testUser.clerkId,
    stripePaymentLink: "http://example.com/stripe-payment-link",
    stripeProductId: "test-stripe-product-id",
  };

  describe("Sample pack", () => {
    describe("Create", () => {
      beforeEach(async () => {
        await createUser(testUser);
      });

      afterEach(async () => {
        await deleteSamplePack({
          samplePackName: samplePackData.name,
          userName: testUser.userName,
        });
        await deleteUser(testUser.clerkId);
      });

      it("should create a sample pack", async () => {
        const samplePack = await createSamplePack(samplePackData);
        expect(samplePack).toBeDefined();
      });

      it("should return null if sample pack with the same name for same user", async () => {
        // create sample pack with same name twice
        await createSamplePack(samplePackData);
        const samplePack = await createSamplePack(samplePackData);
        expect(samplePack).toBeNull();
      });
    });

    describe("Read", () => {
      beforeEach(async () => {
        await createUser(testUser);
        await createSamplePack(samplePackData);
      });

      afterAll(async () => {
        await deleteSamplePack({
          samplePackName: samplePackData.name,
          userName: testUser.userName,
        });
        await deleteUser(testUser.clerkId);
      });

      it("should read a sample pack", async () => {
        const data = await getSamplePack({
          samplePackName: samplePackData.name,
          userName: testUser.userName,
        });

        expect(data).toBeDefined();
        expect(data?.name).toBe(samplePackData.name);
      });
      it("should return null for non-existent sample pack", async () => {
        const data = await getSamplePack({
          samplePackName: "non-existent-sample-pack",
          userName: testUser.userName,
        });

        expect(data).toBeNull();
      });

      it("should return null for non-existent user", async () => {
        const data = await getSamplePack({
          samplePackName: samplePackData.name,
          userName: "non-existent-user",
        });

        expect(data).toBeNull();
      });
    });

    describe("Update", () => {
      it("should update a sample pack", async () => {
        const user = await createUser(testUser);
        if (!user) throw new Error("Error creating user");
        const samplePack = await createSamplePack(samplePackData);
        if (!samplePack) throw new Error("Error creating sample pack");
        const data = {
          ...samplePackData,
          userId: user.id,
          title: "updated title",
          description: "updated description",
          price: 200,
          userName: testUser.userName,
        };
        const updatedSamplePack = await updateSamplePack(data);
        if (!updatedSamplePack) throw new Error("Error updating sample pack");
        expect(updatedSamplePack.title).toBe(data.title);
        expect(updatedSamplePack.description).toBe(data.description);
        expect(updatedSamplePack.price).toBe(data.price);

        await deleteSamplePack({
          samplePackName: updatedSamplePack.name,
          userName: testUser.userName,
        });
        await deleteUser(testUser.clerkId);
      });

      it("should return null for updating a non-existent sample pack", async () => {
        const user = await createUser(testUser);
        if (!user) throw new Error("Error creating user");
        const samplePack = await createSamplePack(samplePackData);
        if (!samplePack) throw new Error("Error creating sample pack");
        const data = {
          ...samplePackData,
          name: "non-existent-sample-pack",
          userId: user.id,
          title: "updated title",
          description: "updated description",
          price: 200,
          userName: testUser.userName,
        };
        const updatedSamplePack = await updateSamplePack(data);
        expect(updatedSamplePack).toBeNull();

        await deleteSamplePack({
          samplePackName: samplePackData.name,
          userName: testUser.userName,
        });
        await deleteUser(testUser.clerkId);
      });
    });

    describe("Delete", () => {
      it("should delete a sample pack", async () => {
        const user = await createUser(testUser);
        if (!user) throw new Error("Error creating user");
        const samplePack = await createSamplePack(samplePackData);
        if (!samplePack) throw new Error("Error creating sample pack");
        const data = {
          samplePackName: samplePackData.name,
          userName: testUser.userName,
        };
        const result = await deleteSamplePack(data);
        const deletedPack = await getSamplePack(data);
        expect(result).toBe(true);
        expect(deletedPack).toBeNull();
      });
    });
  });
});
