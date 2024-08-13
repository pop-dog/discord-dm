import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Commands } from './commands/commands.js';
import { Events } from './events/events.js';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for (const command of Commands) {
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command is missing a required "data" or "execute" property.`);
	}
}

for (const event of Events) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.cooldowns = new Collection();

client.login(process.env.DISCORD_TOKEN);

// Express health check
const app = express();
const port = (process.env.PORT || 5000);

app.get('/', (req, res) => {
  res.send('Ye Olde Popbot is alive and well!')
})

app.listen(port, () => {
  console.log(`Ye Olde Popbot is listening on port ${port}`)
})