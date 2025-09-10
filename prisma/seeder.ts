import { PrismaClient } from "@prisma/client";
import readlineHelper from "./utils/readlineHelper.ts";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { withAccelerate } from "@prisma/extension-accelerate";
import progressBar from "./utils/progressBar.ts";

const prisma = new PrismaClient().$extends(withAccelerate());

async function seeder() {
  try {
    const userInput = await readlineHelper();
    if (!userInput) {
      return;
    }

    const { dropCreateAdmin, numUsers } = userInput;
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

    console.log("Seeding database...");
    if (dropCreateAdmin) {
      await prisma.user.deleteMany();
      const admin = {
        admin: true,
        username: "trueAdmin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin123", SALT_ROUNDS),
        preferences: {
          units: "metric",
          notifications: true,
        },
      };
      await prisma.user.create({ data: admin });
    }

    console.log(`Creating ${numUsers} users`);
    const users = [];

    for (let i = 0; i < numUsers; i++) {
      const user = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
        preferences: {
          units: faker.helpers.arrayElement(["metric", "imperial", "standard"]),
          notifications: faker.datatype.boolean(),
        },
      };
      users.push(user);
      progressBar(numUsers, i);
    }
    await prisma.user.createMany({ data: users });
    console.log("\nDatabase seeded successfully");
  } catch (error) {
    console.error("\nError seeding database: " + error);
  }
}

seeder();
