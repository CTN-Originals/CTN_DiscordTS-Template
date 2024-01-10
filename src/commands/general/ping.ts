import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";

import { cons } from "../../index";

export default {
	command: {
		data: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Replies with Pong!"),
		async execute(interaction: CommandInteraction) {
			await interaction.reply({
				content: "Pong!",
				embeds: [new EmbedBuilder({
					title: "Pong!",
				})]
			});

			return true;
		},
	}
}