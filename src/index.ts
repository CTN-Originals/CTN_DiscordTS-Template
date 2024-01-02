import 'dotenv/config';
import { Client } from 'discord.js';

import { ConsoleInstance, Theme, ThemeOverride } from 'better-console-utilities';

import { getEventFiles } from './handlers/registerEvents';

export const cons = new ConsoleInstance();
cons.theme.overrides.push(...[
	new ThemeOverride(/HH Utilities/gi, new Theme(null, null, ['line', 'bold'])),
	new ThemeOverride(/MT.*Oik/gi, new Theme('#000000', '#000000', 'hidden'))
])

const client = new Client({
	intents: [
		'Guilds',
		'GuildMessages',
		'GuildMembers',
		'MessageContent'
	]
});

getEventFiles(client, 'events');


client.login(process.env.TOKEN);