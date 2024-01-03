import 'dotenv/config';
import { Client, Collection } from 'discord.js';

import { ConsoleInstance, Theme, ThemeOverride } from 'better-console-utilities';

import { getEventFiles } from './handlers/registerEvents';
import { getCommandFiles } from './handlers/registerCommands';

export const cons = new ConsoleInstance();
cons.theme.overrides.push(...[
	new ThemeOverride(/HH Utilities/gi, new Theme(null, null, ['line', 'bold'])),
	new ThemeOverride(/MT.*Oik/gi, new Theme('#000000', '#000000', 'hidden'))
])

export const client: Client = new Client({
	intents: [
		'Guilds',
		'GuildMessages',
		'GuildMembers',
		'MessageContent'
	]
});
cons.logDefault(client);
client['commands'] = new Collection();

getEventFiles(client, 'events');
getCommandFiles(client, 'commands');


client.login(process.env.TOKEN);