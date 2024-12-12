import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, ApplicationCommandOptionType, InteractionContextType, PermissionsBitField, ActionRowBuilder, TextInputBuilder, ComponentType, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, ButtonInteraction, EmbedBuilder } from "discord.js";
import { BaseButtonCollection, BaseEmbedCollection, BaseSelectMenuCollection, CommandInteractionData, CommandObject, IButtonCollection, IButtonCollectionField, ISelectMenuCollection } from "../../handlers/commandBuilder";


class ButtonCollection extends BaseButtonCollection implements IButtonCollection<ButtonCollection> {
	public x: IButtonCollectionField = {
		data: {
			customId: 'xButt',
			label: 'xButt'
		},
		execute: async function (interaction: ButtonInteraction) {
			await interaction.reply({
				content: 'you clicked a butt'
			});
		},
	}
}
class SelectMenuCollection extends BaseSelectMenuCollection implements ISelectMenuCollection<SelectMenuCollection> {

}
class EmbedCollection extends BaseEmbedCollection {
	public get pong() {
		return new EmbedBuilder({
			title: "Pong!",
			description: "ping pong!",
		});
	}
}

const command = new CommandInteractionData<ButtonCollection, SelectMenuCollection, EmbedCollection>({
	command: {
		data: {
			name: 'ping',
			description: 'Replies with Pong! [Test Command]',
			contexts: [InteractionContextType.Guild],
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'string',
					description: 'Some Description',
					choices: [
						{
							name: 'Hello',
							value: 'hello'
						},
						{
							name: 'World',
							value: 'world'
						},
					]
				},
				{
					type: ApplicationCommandOptionType.User,
					name: 'user',
					description: 'Some user',
				}
			],
		},
		execute: async function (interaction: ChatInputCommandInteraction) {
			await interaction.reply({
				content: "Pong! <@479936093047750659>",
				embeds: [],
				ephemeral: true
			});

			// await interaction.reply('<@568245462293938196> is the real npc here...')

			await interaction.followUp({
				content: "poing",
			});

			const row: any = new ActionRowBuilder({components: [command.buildButtons()[0]]})

			await interaction.editReply({
				content: "uped ping down pong",
				embeds: [command.embeds.pong],
				components: [row]
				// embeds: [new EmbedBuilder({
				// 	title: "Pong!",
				// 	description: "uped ping down pong!",
				// })],
			});

			// console.log(interaction.token);
			
			return true;
		},
	},
	buttons: new ButtonCollection(),
	selectMenus: new SelectMenuCollection(),
	embeds: new EmbedCollection()
})

export default command;