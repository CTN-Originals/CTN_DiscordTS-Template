import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";

import { cons } from "../../index";

export default {
	command: {
		data: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Replies with Pong!"),
		async execute(interaction: CommandInteraction) {
			cons.log(`[fg=red]Running[/>] ([fg=cyan]${interaction.commandName}[/>]) [fg=red]command[/>]`);
			interaction.reply({
				content: "Pong!",
				embeds: [new EmbedBuilder({
					title: "Pong!",
				})]
			});

			// //? make an error happen for testing purposes
			// const member = await interaction.guild?.members.fetch("this is not a member id");
			// // console.log(member?.displayName);

			return true;
		},
	}
}