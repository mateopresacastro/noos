import { createUser, readUser, updateUser, deleteUser } from "@/lib/db/mod";
import prisma from "@/lib/db/client";

describe("DB", () => {
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
        await prisma.user.delete({
          where: {
            clerkId: testUser.clerkId,
          },
        });
      }
    } catch (error) {
      console.error("Error deleting test user:", error);
    } finally {
      await prisma.$disconnect();
    }
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const user = await createUser({ ...testUser });
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

  describe("readUser", () => {
    it("should read a user", async () => {
      const user = await readUser({ clerkId: testUser.clerkId });
      expect(user).toMatchObject(testUser);
    });

    it("should return null for non-existent user", async () => {
      const user = await readUser({ clerkId: "non-existent-clerk-id" });
      expect(user).toBeNull();
    });
  });

  describe("updateUser", () => {
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

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const deletedUser = await deleteUser({ clerkId: testUser.clerkId });
      expect(deletedUser?.clerkId).toBe(testUser.clerkId);
    });

    it("should return null for non existing user", async () => {
      const user = await readUser({ clerkId: testUser.clerkId });
      expect(user).toBeNull();
    });
  });
});
