import readline from "node:readline";
import { stdout as output } from "node:process";

export default function progressBar(total: number, current: number) {
  const progress = Math.round((current / total) * 100);
  readline.clearLine(output, 0);
  readline.cursorTo(output, 0);
  output.write(`Progress: ${progress}%`);
}
