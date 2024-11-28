import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, ApplicationCommandOptionType, InteractionContextType, PermissionsBitField } from "discord.js";
import { CommandObject } from "../../handlers/commandBuilder/command";
import { testCmd } from '../../../tests'

export default {
	command: {
		data: testCmd.build,
		async execute(interaction: ChatInputCommandInteraction) {
			console.log(testCmd)
			await interaction.reply({
				content: 'Success!'
			});

			return true;
		}
	}
}
