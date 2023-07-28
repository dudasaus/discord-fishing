import { Logging } from "@google-cloud/logging";
import { env } from "node:process";

const projectId = "discord-fishing";
const defaultLog = env["GAE_ENV"] ? "prod" : "local";

const logging = new Logging({ projectId });

function logInfo(message) {
  console.log(message);
  const log = logging.log(defaultLog);
  const metadata = {
    severity: "INFO",
  };
  const entry = log.entry(metadata, message);
  log.write(entry);
}

export { logInfo };
