import 'dotenv/config';
import { Client } from 'discord.js';
import { ConsoleInstance } from 'better-console-utilities';

export const cons = new ConsoleInstance();

const client = new Client({
	intents: [
		'Guilds',
		'GuildMessages',
		'GuildMembers',
		'MessageContent'
	]
});

client.on('ready', (c) => {
	cons.log(`Logged in as ${c.user.tag}!`);
});

client.login(process.env.TOKEN);