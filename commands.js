require("dotenv/config");
const { program } = require("commander");

program
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-p, --prod", "Deploy commands to prod")
  .option("-d, --dry-run", "Dry run: don't deploy any commands", false)
  .parse(process.argv);

const options = program.opts();
const { prod, dryRun } = options;

// Fish command
const FISH_COMMAND = {
  name: "fish",
  description: "Go fishing",
  type: 1,
};

const CATCHES_COMMAND = {
  name: "catches",
  description: "View your past fish catches",
  type: 1,
};

const ADVANCED_FISH_COMMAND = {
  name: "advanced-fish",
  description: "New and improved fishing",
  type: 1,
};

const ALL_COMMANDS = [FISH_COMMAND, CATCHES_COMMAND, ADVANCED_FISH_COMMAND];
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

if (!dryRun) {
  InstallGlobalCommands(appId, commands, token);
} else {
  console.log("Dry run commands to register:", commands);
}

/**** Functions from Discord. ****/
async function DiscordRequest(endpoint, options, token) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

async function InstallGlobalCommands(appId, commands, token) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: "PUT", body: commands }, token);
  } catch (err) {
    console.error(err);
  }
}
