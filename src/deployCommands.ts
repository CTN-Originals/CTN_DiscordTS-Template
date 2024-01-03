import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import * as fs from 'node:fs';
import 'dotenv/config';

import { ConsoleInstance, ThemeOverride, Theme } from 'better-console-utilities';
const cons = new ConsoleInstance();
cons.theme.overrides.push(...[
	new ThemeOverride(/HH Utilities/gi, new Theme(null, null, ['line', 'bold'])),
	new ThemeOverride(/MT.*Oik/gi, new Theme('#000000', '#000000', 'hidden'))
])

interface CommandData {
	name: string;
	// Add other properties as needed
}

const commands: CommandData[] = [];
const token: string = process.env.TOKEN as string;
const clientID: string = process.env.CLIENT_ID as string;


function getCommandFiles(dir: string) {
	const commandFiles = fs.readdirSync(__dirname + '/' + dir);
	for (const file of commandFiles) {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			// if (instructions.all) {
			// 	if (file.startsWith('_')) {
			// 		continue;
			// 	} //* Skip files that start with '_' (private (non-command) files)
			// 	registerCommand(dir, file);
			// }
			// else if (instructions.dir.includes(dir) || instructions.file.includes(file)) {
			// 	if (file.startsWith('_')) {
			// 		continue;
			// 	} //* Skip files that start with '_' (private (non-command) files)
			// 	registerCommand(dir, file);
			// }
			registerCommand(dir, file);
		}
		else if (file.match(/[a-zA-Z0-9 -_]+/i)) {
			if (file == 'archive') { //? Skip the archive folder
				continue;
			} 
			getCommandFiles(dir + '/' + file);
		}
	}
}

function registerCommand(dir: string, file: string) {
	const commandFile = require(`./${dir}/${file}`).default;
	let command;
	for (const key in commandFile) {
		if (key == 'command') {
			command = commandFile[key];
			break;
		}
	}
	if (!command) {
		command = commandFile;
	}
	// cons.log(command);
	const commandData = command.data.toJSON();
	
	commands.push(commandData);
	cons.log([
		`./[fg=green]${dir}[/>]/[fg=green]${file}[/>]`,
		' - [fg=cyan]',
		commandData.name,
		'[/>]'
	].join(''));
}
	
getCommandFiles('commands');

// console.log(guildId);
const rest = new REST({ version: '9' }).setToken(token);

/* //TODO: Get guild commands and compare to commands array, only update if different
	const getGuildCommands = (async () => {
		const cmd = await rest.get(Routes.applicationGuildCommands(generalData.clientId, guildId));
		console.log(cmd);
		return cmd;
	})();
	console.log(getGuildCommands);
*/

const args = process.argv.slice(2);
const guildID = args[0];

if (guildID) {
	rest.put(Routes.applicationGuildCommands(clientID, guildID), {
		body: commands,
	}).then(() =>
		cons.log(`Successfully registered application commands for Guild: ${guildID}.`)
	).catch((error) => console.log(error));
}
else {
	cons.log('No Guild ID provided, registering commands Globally is not supported, yet.');
	//! This registers the command twice (once globally and once for the guild)
	//TODO figure out how this actually works
	// rest.put(Routes.applicationCommands(clientID), {
	// 	body: commands,
	// }).then(() =>
	// 	cons.log('Successfully registered application commands Globally.')
	// ).catch((error) => console.log(error));
}


// setInterval(() => {}, 1 << 30); //? Keep the process running
