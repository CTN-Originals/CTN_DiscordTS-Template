import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { cons } from "../../index";

export default {
	command: {
		data: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Replies with Pong!"),
		async execute(interaction: any) {
			cons.log(`[fg=red]Running[/>] ([fg=cyan]${interaction.commandName}[/>]) [fg=red]command[/>]`);
			interaction.reply({
				content: "Pong!",
				embeds: [new EmbedBuilder({
					title: "Pong!",
				})]
			});
		},
	}
}