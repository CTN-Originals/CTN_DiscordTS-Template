import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, ApplicationCommandOptionType, InteractionContextType, PermissionsBitField, ActionRowBuilder, TextInputBuilder, ComponentType, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, ButtonInteraction } from "discord.js";
import { BaseButtonCollection, BaseEmbedCollection, BaseSelectMenuCollection, CommandInteractionData, CommandObject, IButtonCollection, IButtonCollectionField, ISelectMenuCollection } from "../../handlers/commandBuilder";

class ButtonCollection extends BaseButtonCollection implements IButtonCollection<ButtonCollection> {
	public x: IButtonCollectionField = {
		data: {
			customId: 'butt',
			label: 'BUTT'
		},
		execute: async function (interaction: ButtonInteraction) {},
	}
}
class SelectMenuCollection extends BaseSelectMenuCollection implements ISelectMenuCollection<SelectMenuCollection> {

}
class EmbedCollection extends BaseEmbedCollection {

}

const command = new CommandInteractionData<ButtonCollection, SelectMenuCollection, EmbedCollection>({
	command: {
		data: {
			name: 'command-builder',
			description: 'This command is a test for the new builder system'
		},
		execute: async function (interaction: ChatInputCommandInteraction) {
			await interaction.reply({
				content: `Success!`
			})
			return true;
		},
	},
	buttons: new ButtonCollection(),
	selectMenus: new SelectMenuCollection(),
	embeds: new EmbedCollection()
})



export default command;
