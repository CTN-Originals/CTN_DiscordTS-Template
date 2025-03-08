import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction, ApplicationCommandOptionType, InteractionContextType, PermissionsBitField, ActionRowBuilder, TextInputBuilder, ComponentType, TextInputStyle, ButtonBuilder, StringSelectMenuBuilder, ButtonInteraction, ApplicationCommandType, MessageContextMenuCommandInteraction, ContextMenuCommandInteraction } from "discord.js";
import { BaseButtonCollection, BaseEmbedCollection, BaseSelectMenuCollection, CommandInteractionData, CommandObject, IButtonCollection, IButtonCollectionField, ISelectMenuCollection } from "../../handlers/commandBuilder";
import { IBaseInteractionType } from "../../handlers/commandBuilder/data";

class ButtonCollection extends BaseButtonCollection implements IButtonCollection<ButtonCollection> {
	public x: IButtonCollectionField = {
		data: {
			customId: 'buttt',
			label: 'BUTTs'
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
		interactionType: IBaseInteractionType.ContextMenu,
		data: {
			name: 'msgcontext',
			type: ApplicationCommandType.Message,
		},
		execute: async function (interaction: ContextMenuCommandInteraction) {
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
