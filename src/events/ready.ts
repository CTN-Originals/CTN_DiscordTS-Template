import { ConsoleInstance } from 'better-console-utilities';
import { Client } from 'discord.js';
// import ErrorHandler from '../handlers/errorHandler';

const thisCons = new ConsoleInstance();

export default {
	name: 'ready',
	once: true,

	/**
	 * @param {Client} client The command interaction
	*/
	async execute(client: Client) {
		thisCons.log(`Logged in as ${client.user?.tag}!`);
		// new ErrorHandler(new Error('test'));
	},
};