import type { Guild } from 'discord.js';
import { Events } from 'discord.js';

import { eventConsole } from '.';
import { UpdateBotListStats } from '../handlers/botLists';

export default {
	name: Events.GuildDelete,
	once: false,

	async execute(guild: Guild) {
		eventConsole.log(`\nOn: [fg=green]${this.name}[/>]\nName: ${guild.name}\nID: ${guild.id}\nMembers: ${guild.memberCount}\n`);
		
		//TODO Remove guild documents from the database

		UpdateBotListStats();
	},
};