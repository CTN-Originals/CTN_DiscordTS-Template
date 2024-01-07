import { Client } from "discord.js";
import { ConsoleInstance } from "better-console-utilities";
import { eventConsole } from ".";

const thisCons = new ConsoleInstance();

export default {
	name: 'rateLimit',
	once: false,

	async execute(client: Client, ...args: any[]) {
		eventConsole.log(...args);
	},
};
