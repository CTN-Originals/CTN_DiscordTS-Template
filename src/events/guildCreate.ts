import type { Guild } from 'discord.js';
import { Events } from 'discord.js';

import { eventConsole } from '.';
import { client } from '..';
import { GeneralData } from '../data';
import { DeployInstruction, doDeployCommands } from '../deployCommands';
import { UpdateBotListStats } from '../handlers/botLists';

export default {
	name: Events.GuildCreate,
	once: false,

	async execute(guild: Guild) {
		eventConsole.log(`\nOn: [fg=green]${this.name}[/>]\nName: ${guild.name}\nID: ${guild.id}\nMembers: ${guild.memberCount}\n`);

		if (GeneralData.development) {
			await doDeployCommands(client, [new DeployInstruction({
				guildId:   guild.id,
				deployAll: true
			})]);
		}

		//TODO Create and add guild document to the database

		UpdateBotListStats();
	},
};