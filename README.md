# Discord Fishing

## Discord Bot installations links

- [Prod](https://discord.com/api/oauth2/authorize?client_id=892529887271854130&permissions=2048&scope=bot%20applications.commands)
- [Dev](https://discord.com/api/oauth2/authorize?client_id=1134821767085555782&permissions=2048&scope=applications.commands%20bot)

## npm scripts

### start

Starts the server from `serverDist/index.js`. Run `npm run build` first.

Note that you should use `npm run dev` for local development.

### build

Builds the node server from the TypeScript files.

- Input directory: `src/`
- Output directory: `serverDist/`

### dev

Watches local files in `src/` for changes, recompiles and restarts the server at
http://localhost:3000.

See `dev.js`

### ngrok

Starts an ngrok tunnel to point to http://localhost:3000. Required for testing WebHooks locally.

Run `ngrok config check` to see ngrok settings for `npm run ngrok`

### register

Registers/updates the Discord bot's `dev-` commands from `commands.js`.

### register-prod

Registers/updates the Discord bot's commands from `command.js`.
