import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
	command: {
		data: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Replies with Pong! [Test Command]")
			.addStringOption(option => 
				option.setName('string')
				.setDescription('Some description')
				.setRequired(false)
				.addChoices(
					{name: 'Hello', value: 'hello'},
					{name: 'World', value: 'world'},
				)
			)
			.addUserOption(option =>
				option.setName('user')
				.setDescription('Some user')
				.setRequired(false)
			),
		async execute(interaction: CommandInteraction) {
			const nonMember = await interaction.guild?.members.fetch('713586058107414558'); //? cause an error
			console.log(nonMember?.displayName);

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