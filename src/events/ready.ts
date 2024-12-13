import 'dotenv/config';
import { Client, Collection, Events, GuildMember, Routes } from 'discord.js';

import { ConsoleInstance } from 'better-console-utilities';

import { GeneralData } from '../data';
import { DevEnvironment } from '../data';

const thisConsole = new ConsoleInstance();

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client, ...args: any[]) {
		thisConsole.log(`Logged in as ${client.user?.tag}!\n`);
		const devGuildMembers = await client.guilds.cache.get(process.env.DEV_GUILD_ID!)?.members.fetch();

		if (GeneralData.development) {
			DevEnvironment.client = client;
			DevEnvironment.memberList = devGuildMembers as Collection<string, GuildMember>;

			DevEnvironment.guild = client.guilds.cache.get(process.env.DEV_GUILD_ID!);
			DevEnvironment.user = await client.users.fetch(process.env.DEV_TEST_USER_ID!);
			DevEnvironment.member = DevEnvironment.memberList.get(process.env.DEV_TEST_USER_ID!);
			DevEnvironment.channel = DevEnvironment.guild?.channels.cache.get(process.env.DEV_TEST_CHANNEL_ID!);

			DevEnvironment.restCommands = await client.rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.DEV_GUILD_ID!)) as {id: string, name: string, type: number, guild_id: string}[];

			// thisConsole.logDefault('Dev Environment:', DevEnvironment);
		}

		this.runTests(client);
	},

	async runTests(client: Client) {
		// const guild: Guild|undefined = client.guilds.cache.get(process.env.DEV_GUILD_ID!);
	}
};