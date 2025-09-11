import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function readlineHelper() {
  const rl = readline.createInterface({ input, output });
  let dropDB = false;
  let admin = false;

  try {
    const drop = await rl.question("Should the DB be dropped? (y/n) ");
    if (drop.toLowerCase() === "y" || drop.toLowerCase() === "yes") {
      dropDB = true;
    }
    const createAdmin = await rl.question("Should an admin be created? (y/n) ");
    if (
      createAdmin.toLowerCase() === "y" ||
      createAdmin.toLowerCase() === "yes"
    ) {
      admin = true;
    }
    const askNumUsers = async () => {
      const answer = await rl.question(
        "How many users do you want to create? "
      );
      const num = Number(answer);
      if (isNaN(num)) {
        console.error("Please enter a valid number.");
        return askNumUsers();
      }
      if (num < 0) {
        console.error("Please enter a positive number.");
        return askNumUsers();
      }
      if (num > 1000) {
        console.error("Please enter a number less than or equal to 1000.");
        return askNumUsers();
      }
      return num;
    };
    const numUsers = await askNumUsers();
    return {
      dropDB,
      admin,
      numUsers,
    };
  } catch (error) {
    console.error("Error seeding database: " + error);
    throw error;
  } finally {
    rl.close();
  }
}

export default readlineHelper;
