import { EmbedBuilder, SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
	command: {
		data: new SlashCommandBuilder()
			.setName("sub-ping")
			.setDescription("Sub command Replies with Pong! [Test Command]")
			.addSubcommandGroup(group =>
				group.setName('subgroup')
				.setDescription('Some subgroup')
				.addSubcommand(subcommand => 
					subcommand.setName('sub-group-ping')
					.setDescription('Replies with Pong! [Test Command]')
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
					)
				)
			)
			.addSubcommand(subcommand =>
				subcommand.setName('sub-ping')
				.setDescription('Replies with Pong! [Test Command]')
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
				)
			),
		async execute(interaction: CommandInteraction) {
			const nonMember = await interaction.guild?.members.fetch('713586058107414558'); //? cause an error

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