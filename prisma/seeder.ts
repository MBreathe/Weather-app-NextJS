import { PrismaClient, Prisma } from "@/generated/prisma";
import readlineHelper from "./utils/readlineHelper";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { withAccelerate } from "@prisma/extension-accelerate";
import progressBar from "./utils/progressBar";

const prisma = new PrismaClient().$extends(withAccelerate());
enum Units {
  metric = "metric",
  imperial = "imperial",
  standard = "standard",
}

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
      const admin: Prisma.UserCreateInput = {
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
    const users: Prisma.UserCreateInput[] = [];

    for (let i = 0; i < numUsers; i++) {
      const user: Prisma.UserCreateInput = {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
        preferences: {
          units: faker.helpers.enumValue(Units),
          notifications: faker.datatype.boolean(),
        },
      };
      users.push(user);
      i++;
      progressBar(numUsers, i);
    }
    await prisma.user.createMany({ data: users });
    console.log("\nDatabase seeded successfully");
  } catch (error) {
    console.error("\nError seeding database: " + error);
  }
}

seeder();
