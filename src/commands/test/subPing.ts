import { EmbedBuilder, SlashCommandBuilder, CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";

export default {
	recentReply: null,
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
			// const nonMember = await interaction.guild?.members.fetch('713586058107414558'); //? cause an error

			const select = new StringSelectMenuBuilder({
				custom_id: 'string-select-test',
				options: [
					{
						label: 'Hello',
						value: 'hello',
						description: 'Hello world'
					},
					{
						label: 'World',
						value: 'world',
						description: 'Hello world'
					},
				]
			});
			const row: any = new ActionRowBuilder().addComponents(select);

			module.exports.recentReply = await interaction.reply({
				content: "Pong!",
				embeds: [new EmbedBuilder({
					title: "Pong!",
				})],
				components: [row],
				ephemeral: true,
				fetchReply: true,
			});

			console.log(module.exports.recentReply);


			return true;
		},
	},
	selectMenus: [
		{
			data: new SlashCommandBuilder()
				.setName("string-select-test"),
			
			async execute(interaction: StringSelectMenuInteraction) {
				
				await interaction.reply({
					content: "Pong!",
					embeds: [new EmbedBuilder({
						title: "Selected: " + interaction.values[0] ?? "None",
					})],
				});

				// const res = await (module.exports.recentReply as Message).

				return true;
			}
		}
	]
}