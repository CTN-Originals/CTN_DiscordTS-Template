import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { CommandObjectBase } from "./base";
import { CommandObject } from "./command";
import { 
	AnySlashCommandOption,
	CommandObjectAttachmentOption,
	CommandObjectBooleanOption,
	CommandObjectChannelOption,
	CommandObjectIntegerOption,
	CommandObjectMentionableOption,
	CommandObjectNumberOption,
	CommandObjectRoleOption,
	CommandObjectStringOption,
	CommandObjectUserOption,
} from "./options";
import { ISubcommandGroupObject, SubcommandGroupObject } from "./subcommandGroup";
import { SubcommandObject, ISubcommandObject } from "./subcommand";

export { 
	AnySlashCommandOption,
	CommandObjectBase,

	CommandObject,

	ISubcommandObject,
	SubcommandObject,

	ISubcommandGroupObject,
	SubcommandGroupObject,

	CommandObjectAttachmentOption,
	CommandObjectBooleanOption,
	CommandObjectChannelOption,
	CommandObjectIntegerOption,
	CommandObjectMentionableOption,
	CommandObjectNumberOption,
	CommandObjectRoleOption,
	CommandObjectStringOption,
	CommandObjectUserOption,
}

export type AnySlashCommandBuilder = 
	SlashCommandBuilder | 
	SlashCommandSubcommandBuilder | 
	SlashCommandSubcommandGroupBuilder;

export type RequiredBaseFields = 'name' | 'description';
export type OptionalBaseFields = 'name_localizations' | 'description_localizations';

export type CommandObjectInput<
    T extends CommandObjectBase,
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
