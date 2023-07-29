import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";
import { program } from "commander";

program
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-p, --prod", "Deploy commands to prod")
  .parse(process.argv);

const options = program.opts();
const { prod } = options;

// Fish command
const FISH_COMMAND = {
  name: "fish",
  description: "Go fishing",
  type: 1,
};

const ALL_COMMANDS = [FISH_COMMAND];
const ALL_COMMANDS_DEV = ALL_COMMANDS.map((command) => {
  const devCommand = { ...command };
  devCommand.name = `dev-${command.name}`;
  return devCommand;
});

const appId = prod
  ? process.env.PROD_DISCORD_APP_ID
  : process.env.DISCORD_APP_ID;
const token = prod ? process.env.PROD_DISCORD_TOKEN : process.env.DISCORD_TOKEN;
const commands = prod ? ALL_COMMANDS : ALL_COMMANDS_DEV;

InstallGlobalCommands(appId, commands, token);
