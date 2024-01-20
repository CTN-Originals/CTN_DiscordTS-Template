import 'dotenv/config';
import { Client, Collection, WebhookClient } from 'discord.js';

import { ConsoleInstance, Theme, ThemeOverride, defaultThemeProfile } from 'better-console-utilities';

import { getEventFiles } from './handlers/registerEvents';
import { getCommandFiles } from './handlers/registerCommands';

import * as deployScript from './deployCommands';

//? Set the default theme profile to my preferences
defaultThemeProfile.overrides.push(...[]);

export const cons = new ConsoleInstance();
export const errorConsole = new ConsoleInstance(defaultThemeProfile.clone());
errorConsole.theme.default = new Theme('#ff0000');
errorConsole.theme.typeThemes.default = new Theme('#dd0000');

export const client: Client = new Client({
	intents: [
		'Guilds',
		'GuildMessages',
		'GuildMembers',
		'MessageContent'
	]
});
export const logWebhook = new WebhookClient({id: process.env.LOG_WEBHOOK_ID!, token: process.env.LOG_WEBHOOK_TOKEN!});
export const testWebhook = new WebhookClient({id: process.env.TEST_WEBHOOK_ID!, token: process.env.TEST_WEBHOOK_TOKEN!});

async function Awake() {
	if (process.argv.includes('--deploy')) {
		cons.log(process.argv);
		// const deployScript = require('./deployCommands.ts');
		await deployScript.doDeployCommands().then(() => {
			process.exit(0);
		});
	}
	else {
		Start();
	}
}

async function Start() {
	client.commands = new Collection();
	
	getEventFiles(client, 'events');
	getCommandFiles(client, 'commands');
	await client.login(process.env.TOKEN);
}

Awake();


