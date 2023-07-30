/**
 * Runs tsc and nodemon for instant compilation and server restarts during development.
 */
const { spawn } = require("node:child_process");
const { exit, cwd } = require("node:process");

const commands = [
  { command: "bash", options: ["npx", "tsc", "--watch"] },
  { command: "bash", options: ["npx", "nodemon"] },
];

const subprocesses = [];

for (let x of commands) {
  const subprocess = spawn(x.command, x.options, { cwd: cwd() });
  subprocess.stdout.on("data", (data) => {
    console.log(`${data}`);
  });
  subprocess.stderr.on("data", (data) => {
    console.error(`${data}`);
  });
  subprocess.on("close", (code) => {
    console.log(`${subprocess.pid}: Exited with code ${code}`);
  });
  subprocess.on("error", (data) => {
    console.error({ error: data });
    exit();
  });

  console.log({
    pid: subprocess.pid,
    command: [x.command, ...x.options].join(" "),
  });
}
