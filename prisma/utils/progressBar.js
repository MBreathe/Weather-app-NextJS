"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = progressBar;
var node_readline_1 = require("node:readline");
var node_process_1 = require("node:process");
function progressBar(total, current) {
  var progress = Math.round((current / total) * 100);
  node_readline_1.default.clearLine(node_process_1.stdout, 0);
  node_readline_1.default.cursorTo(node_process_1.stdout, 0);
  node_process_1.stdout.write("Progress: ".concat(progress, "%"));
}
