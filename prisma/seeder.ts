import { PrismaClient, Prisma } from "@prisma/client";
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

    const { dropDB, admin, numUsers } = userInput;
    const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

    console.log("Seeding database...");
    if (dropDB) {
      await prisma.user.deleteMany();
    }
    if (admin) {
      const admin: Prisma.UserCreateInput = {
        admin: true,
        username: "trueAdmin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("admin123", SALT_ROUNDS),
        location: { city: "Amsterdam" },
        preferences: {
          units: "metric",
          notifications: true,
        },
      };
      await prisma.user.create({ data: admin });
    }

    if (numUsers === 0) {
      console.log("No users to create");
    } else {
      console.log(`Creating ${numUsers} users`);
      const users = [];

      for (let i = 0; i < numUsers; i++) {
        const coords = faker.location.nearbyGPSCoordinate({
          origin: [49.719923, 13.301708],
          radius: 700,
          isMetric: true,
        });
        const user: Prisma.UserCreateInput = {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: await bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
          location: { latitude: coords[0], longitude: coords[1] },
          preferences: {
            units: faker.helpers.arrayElement([
              "metric",
              "imperial",
              "standard",
            ]),
            notifications: faker.datatype.boolean(),
          },
        };
        users.push(user);
        progressBar(numUsers, i + 1);
      }
      await prisma.user.createMany({ data: users });
    }

    console.log("\nDatabase seeded successfully");
  } catch (error) {
    console.error("\nError seeding database: " + error);
  }
}

seeder();
