import { ActionRowComponentOptions, ButtonComponentData, ButtonStyle, ChatInputCommandInteraction, ComponentType, Embed, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { BaseCommandObject } from "./base";
import {
	BaseInteractionEmbeds,
	CommandInteractionData
} from './data'
import {
	CommandObject,
	ISubCommandGroupObject,
	SubCommandGroupObject,
	ISubCommandObject,
	SubCommandObject,
	ICommandObject,
} from "./command";

// import * as options from "./options";
import { 
	AnySlashCommandOption,
	AttachmentOptionObject,
	BooleanOptionObject,
	ChannelOptionObject,
	IntegerOptionObject,
	MentionableOptionObject,
	NumberOptionObject,
	RoleOptionObject,
	StringOptionObject,
	UserOptionObject,
} from "./options";

import {
	BaseSelectComponentObject,
	ButtonComponentObject,
	IButtonComponentObject,
	AnyComponentBuilder,
	AnyComponentObject,
	AnySelectMenuComponentObject,
	AnySelectMenuComponentBuilder
} from "./components";

export {
	BaseInteractionEmbeds,
	CommandInteractionData,

	BaseCommandObject,
	
	ICommandObject,
	CommandObject,
	
	ISubCommandObject,
	SubCommandObject,
	
	ISubCommandGroupObject,
	SubCommandGroupObject,
	
	AnySlashCommandOption,
	AttachmentOptionObject,
	BooleanOptionObject,
	ChannelOptionObject,
	IntegerOptionObject,
	MentionableOptionObject,
	NumberOptionObject,
	RoleOptionObject,
	StringOptionObject,
	UserOptionObject,

	AnyComponentBuilder,
	AnyComponentObject,
	IButtonComponentObject,
	ButtonComponentObject,
	AnySelectMenuComponentObject,
	AnySelectMenuComponentBuilder
}

export type AnySlashCommandBuilder = 
	SlashCommandBuilder | 
	SlashCommandSubcommandBuilder | 
	SlashCommandSubcommandGroupBuilder;

export type RequiredBaseFields = 'name' | 'description';
export type OptionalBaseFields = 'name_localizations' | 'description_localizations';

export type CommandObjectInput<
    T extends BaseCommandObject,
    Optional extends keyof T = never,
    Required extends keyof T = never
> = RequiredFields<
    Partial<Pick<T, Optional | OptionalBaseFields>> & Pick<T, RequiredBaseFields | Required>,
    RequiredBaseFields | Required
>;

export const nameAllowedCharacters = [
	'-', '_',
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
	'0','1','2','4','5','6','7','8','9'
];
