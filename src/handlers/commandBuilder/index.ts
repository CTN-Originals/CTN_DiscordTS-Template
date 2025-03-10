//#region Imports
import type {
	ApplicationCommandAttachmentOption,
	ApplicationCommandBooleanOption,
	ApplicationCommandChannelOption,
	ApplicationCommandMentionableOption,
	ApplicationCommandNumericOption,
	ApplicationCommandRoleOption,
	ApplicationCommandStringOption,
	ApplicationCommandUserOption,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	MessageContextMenuCommandInteraction,
	RoleSelectMenuBuilder,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	StringSelectMenuBuilder,
	UserContextMenuCommandInteraction,
	UserSelectMenuBuilder
} from 'discord.js';
import {
	ComponentType
} from 'discord.js';

import {
	BaseCommandObject,
	BaseExecutableCommandObject,
	CommandObjectInput,
	ExecutableCommandObjectInput,
	IBaseExecutableCommandObject,
} from './base';

import type {
	IAnyInteractionField
} from './data';
import {
	BaseButtonCollection,
	BaseComponentCollection,
	BaseEmbedCollection,
	BaseMethodCollection,
	BaseSelectMenuCollection,
	CommandInteractionData,
	IBaseInteractionType,
	IButtonCollection,
	IButtonCollectionField,
	ICommandField,
	ICommandObjectContent,
	IContextMenuField,
	IContextMenuObjectContent,
	ISelectMenuCollection,
	ISelectMenuCollectionField
} from './data';

import {
	CommandObject,
	ICommandObject,
	ISubCommandGroupObject,
	ISubCommandObject,
	SubCommandGroupObject,
	SubCommandObject,
} from './command';

import {
	ContextMenuCommandObject,
	IContextMenuCommandObject,
} from './contextMenus';

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
	UserOptionObject
} from './options';

import type {
	IChannelSelectComponentObject,
	IMentionableSelectComponentObject,
	IRoleSelectComponentObject,
	IStringSelectComponentObject,
	IUserSelectComponentObject
} from './components';
import {
	ButtonComponentObject,
	ChannelSelectComponentObject,
	IButtonComponentObject,

	MentionableSelectComponentObject,
	RoleSelectComponentObject,
	StringSelectComponentObject,
	UserSelectComponentObject
} from './components';

import { includesAny } from '../../utils';

//#endregion

//#region Exports
export {

	AnySlashCommandOption,
	AttachmentOptionObject, BaseButtonCollection, BaseCommandObject, BaseComponentCollection, BaseEmbedCollection, BaseExecutableCommandObject, BaseMethodCollection, BaseSelectMenuCollection, BooleanOptionObject, ButtonComponentObject, ChannelOptionObject, ChannelSelectComponentObject, CommandInteractionData, CommandObject, CommandObjectInput, ContextMenuCommandObject, ExecutableCommandObjectInput,
	IBaseExecutableCommandObject, IBaseInteractionType, IButtonCollection, IButtonCollectionField, IButtonComponentObject, ICommandField, ICommandObject, ICommandObjectContent, IContextMenuCommandObject, IContextMenuField, IContextMenuObjectContent, IntegerOptionObject, ISelectMenuCollection, ISelectMenuCollectionField, ISubCommandGroupObject, ISubCommandObject, MentionableOptionObject, MentionableSelectComponentObject, NumberOptionObject,
	RoleOptionObject, RoleSelectComponentObject, StringOptionObject, StringSelectComponentObject, SubCommandGroupObject, SubCommandObject, UserOptionObject, UserSelectComponentObject
};

export type AnySlashCommandBuilder =
 | SlashCommandBuilder
 | SlashCommandSubcommandBuilder
 | SlashCommandSubcommandGroupBuilder;

export type AnyBuilder = 
 | AnySlashCommandBuilder
 | AnyComponentBuilder;

export type AnyComponentBuilder = 
 | ButtonBuilder
 | StringSelectMenuBuilder
 | UserSelectMenuBuilder
 | RoleSelectMenuBuilder
 | MentionableSelectMenuBuilder
 | ChannelSelectMenuBuilder;

export type AnyInteractionObject = 
| CommandObject
| ContextMenuCommandObject
| ButtonComponentObject
| AnySelectMenuComponentObject;

export type IAnyInteractionObject = 
| ICommandObject
| IContextMenuCommandObject
| IButtonComponentObject
| IAnySelectMenuComponentObject;

export type AnyComponentObject = 
 | ButtonComponentObject
 | StringSelectComponentObject
 | UserSelectComponentObject
 | RoleSelectComponentObject
 | MentionableSelectComponentObject
 | ChannelSelectComponentObject;

export type IAnyComponentObject = 
 | IButtonComponentObject
 | IStringSelectComponentObject
 | IUserSelectComponentObject
 | IRoleSelectComponentObject
 | IMentionableSelectComponentObject
 | IChannelSelectComponentObject;

export type AnyDiscordCommandOption = 
| ApplicationCommandChannelOption
| ApplicationCommandNumericOption
| ApplicationCommandStringOption
| ApplicationCommandRoleOption
| ApplicationCommandUserOption
| ApplicationCommandMentionableOption
| ApplicationCommandBooleanOption
| ApplicationCommandAttachmentOption;

export type AnySelectMenuComponentBuilder = Exclude<AnyComponentBuilder, ButtonBuilder>;
export type AnySelectMenuComponentObject = Exclude<AnyComponentObject, ButtonComponentObject>;
export type IAnySelectMenuComponentObject = Exclude<IAnyComponentObject, IButtonComponentObject>;

export type AnyContextMenuInteraction = MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction;

export const LOG_LEVEL = {
	/** Always log */
	ALWAYS:  0,
	/** Only log when the command was executed successfully */
	SUCCESS: 1 << 1,
	/** Only log when the command was rejected for any reason */
	FAIL:    1 << 2,
	/** Only log when the command threw and error */
	ERROR:   1 << 3,
	/** Never log */
	NEVER:   -1,
} as const;
export type TLogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];

/** Define which environment the bot needs to be in to output a log */
export const LOG_ENVIRONMENT = {
	/** Always log */
	ALL:         0,
	DEVELOPMENT: 1 << 1,
	BETA:        1 << 2,
	PRODUCTION:  1 << 3,
} as const;
export type TLogEnvironment = typeof LOG_ENVIRONMENT[keyof typeof LOG_ENVIRONMENT];

//#endregion

export function getInteractionObject(content: IAnyInteractionField | IAnyInteractionObject): AnyInteractionObject | void {
	if (Object.keys(content).includes('content')) {
		content = content as IAnyInteractionField;
		content = content.content;
	}

	const dataKeys: string[] = Object.keys(content);
	if (dataKeys.includes('description')) { //- it must be a command
		return new CommandObject(content as ICommandObject);
	} else {
		if (!dataKeys.includes('customId')) { //- must be contextMenu
			return new ContextMenuCommandObject(content as IContextMenuCommandObject);
		} else {
			//? from here, it can only be a component
			if (includesAny(dataKeys, ['label', 'emoji'])) { //- Must be a button
				return new ButtonComponentObject(content as IButtonComponentObject);
			} else {
				switch (content['type'] as Omit<ComponentType, ComponentType.Button | ComponentType.ActionRow>) {
					case ComponentType.StringSelect: 		{ return new StringSelectComponentObject(content as never); }
					case ComponentType.UserSelect: 			{ return new UserSelectComponentObject(content as never); }
					case ComponentType.RoleSelect: 			{ return new RoleSelectComponentObject(content as never); }
					case ComponentType.MentionableSelect: 	{ return new MentionableSelectComponentObject(content as never); }
					case ComponentType.ChannelSelect: 		{ return new ChannelSelectComponentObject(content as never); }
				}
			}
		}
	}
}