import type {
	ChannelSelectMenuInteraction,
	Collection,
	MentionableSelectMenuInteraction,
	RoleSelectMenuInteraction,
	StringSelectMenuInteraction,
	UserSelectMenuInteraction,
} from 'discord.js';
import type { BaseButtonCollection, BaseEmbedCollection, BaseMethodCollection, BaseSelectMenuCollection, CommandInteractionData } from '../handlers/commandBuilder';

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, CommandInteractionData<BaseButtonCollection, BaseSelectMenuCollection, BaseEmbedCollection, BaseMethodCollection>>;

		//? lookup tables
		//> <component ID, command name of the command that holds this component>
		buttons: Collection<string, string>; 
		selectMenus: Collection<string, string>;
	}

	declare type ComponentValue = string | string[] | Message | Message[] | Role | Role[] | Channel | Channel[] | User | User[];
}

declare type AnyComponentInteraction = StringSelectMenuInteraction|ChannelSelectMenuInteraction|UserSelectMenuInteraction|MentionableSelectMenuInteraction|RoleSelectMenuInteraction
declare type InteractionDataType =
| 'command'
| 'contextMenu'
| 'button'
| 'selectMenu';
