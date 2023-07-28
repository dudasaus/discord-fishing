import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";

// Fish command
const FISH_COMMAND = {
  name: "fish",
  description: "Go fishing",
  type: 1,
};

const ALL_COMMANDS = [FISH_COMMAND];

InstallGlobalCommands(process.env.DISCORD_APP_ID, ALL_COMMANDS);
