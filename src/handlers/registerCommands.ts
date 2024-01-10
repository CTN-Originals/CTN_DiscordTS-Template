import * as fs from 'node:fs';

import { SlashCommandBuilder } from 'discord.js'; 

import { cons } from '..';

// Get command files
export function getCommandFiles(client: any, dir: string) {
	const commandFiles = fs.readdirSync(__dirname + '/../' + dir);
	for (const file of commandFiles) {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			if (file.startsWith('_')) { continue; } //* Skip files that start with '_' (private (non-command) files)
			registerCommand(client, dir, file);
		}
		// Check if the file is a folder
		else if (file.match(/[a-zA-Z0-9 -_]+/i)) {
			if (file == 'archive') { continue; } //* Skip the archive folder
			getCommandFiles(client, dir + '/' + file);
		}
	}
}

// Register the command files to the client
function registerCommand(client: any, dir: string, file: string) {
	const commandFile = require(`../${dir}/${file}`).default;

	interface IInteraction {
		command: { data: SlashCommandBuilder },
		selectMenus: { data: SlashCommandBuilder }[],
		buttons: { data: SlashCommandBuilder }[],
	};
	const interaction: IInteraction = {
		command: { data: new SlashCommandBuilder() },
		selectMenus: [],
		buttons: [],
	};
	for (const key in commandFile) {
		if (key == 'command') {
			interaction.command = commandFile[key];
		}
		else if (key == 'selectMenus') {
			interaction.selectMenus = commandFile[key];
		}
		else if (key == 'buttons') {
			interaction.buttons = commandFile[key];
		}
	}
	if (!interaction.command) { interaction.command = commandFile; }

	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(interaction.command.data.name, interaction.command);
	cons.log(`Registering [fg=0080ff]Command[/>]: [fg=green]${interaction.command.data.name}[/>] - [fg=cyan]${file}[/>]`);

	// Register the select menus
	for (const selectMenu of interaction.selectMenus) {
		client.commands.set(selectMenu.data.name, selectMenu);
		cons.log(`Registering [fg=0080ff]Select Menu[/>]: [fg=green]${selectMenu.data.name}[/>] - [fg=cyan]${file}[/>]`);
	}
	// Register the buttons
	for (const button of interaction.buttons) {
		client.commands.set(button.data.name, button);
		cons.log(`Registering [fg=0080ff]Button[/>]: [fg=green]${button.data.name}[/>] - [fg=cyan]${file}[/>]`);
	}
}