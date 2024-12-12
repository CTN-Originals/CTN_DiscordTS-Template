import {
	Collection,
	StringSelectMenuInteraction,
	ChannelSelectMenuInteraction,
	UserSelectMenuInteraction,
	MentionableSelectMenuInteraction,
	RoleSelectMenuInteraction,
} from "discord.js";
import { IButtonCollectionField, ISelectMenuCollectionField, ICommandField } from "../handlers/commandBuilder";

declare module "discord.js" {
	interface Client {
		commands: Collection<string, ICommandField>;
		buttons: Collection<string, IButtonCollectionField>;
		selectMenus: Collection<string, ISelectMenuCollectionField>;
	}
}

declare type AnyComponentInteraction = StringSelectMenuInteraction|ChannelSelectMenuInteraction|UserSelectMenuInteraction|MentionableSelectMenuInteraction|RoleSelectMenuInteraction
