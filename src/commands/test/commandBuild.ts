import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction } from "discord.js";
import { CommandObject } from "../../handlers/commandBuilder/command";

export default {
	command: {
		data: new CommandObject({
			name: 'command-build',
			description: 'A test command that is build in a custom way'
		}).build,
		async execute(interaction: ChatInputCommandInteraction) {
			await interaction.reply({
				content: 'Success!'
			});

			return true;
		}
	}
}
