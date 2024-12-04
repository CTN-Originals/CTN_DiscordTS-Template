import { ActionRowComponentOptions, ButtonComponentData, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { BaseCommandObject } from "./base";
import {
	CommandObject,
	ISubCommandGroupObject,
	SubCommandGroupObject,
	ISubCommandObject,
	SubCommandObject,
} from "./command";

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
	IButtonComponentObject
} from "./components";

export { 
	AnySlashCommandOption,
	BaseCommandObject,

	CommandObject,

	ISubCommandObject,
	SubCommandObject,

	ISubCommandGroupObject,
	SubCommandGroupObject,

	AttachmentOptionObject,
	BooleanOptionObject,
	ChannelOptionObject,
	IntegerOptionObject,
	MentionableOptionObject,
	NumberOptionObject,
	RoleOptionObject,
	StringOptionObject,
	UserOptionObject,
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
