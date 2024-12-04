import { ActionRowComponentOptions, ButtonComponentData, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { BaseCommandObject } from "./base";
import {
	CommandObject,
	ISubCommandGroupObject,
	SubCommandGroupObject,
	ISubCommandObject,
	SubCommandObject,
	ICommandObject,
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


type InteractionExecute = (interaction: ChatInputCommandInteraction) => any|any[]|Promise<any|any[]>;

// type InteractionEmbeds<Fields extends string> = {
// 	[key in Fields]: (...args: any[]) => EmbedBuilder | Promise<EmbedBuilder>;
// };
type InteractionEmbeds = {
	[key: string]: (...args: any[]) => EmbedBuilder | Promise<EmbedBuilder>;
};


// type CommandInteractionContentInput<TData extends ICommandObject | ActionRowComponentOptions> = Required<CommandInteractionContent<TData>>
export type CommandInteractionContentInput<
	TData extends ICommandObject | ActionRowComponentOptions,
    Required extends keyof CommandInteractionContent<TData> = 'data' | 'execute'
> = RequiredFields<
    Pick<CommandInteractionContent<TData>, Required>, Required
>;
export class CommandInteractionContent<TData extends ICommandObject | ActionRowComponentOptions> {
	public data: TData;
	public execute: InteractionExecute;

	constructor(input: CommandInteractionContentInput<TData>);
	constructor(data: TData, execute: InteractionExecute);
	constructor(input_data: CommandInteractionContentInput<TData> | TData, execute?: InteractionExecute) {
		if (input_data instanceof CommandInteractionContent) {
			this.data = input_data.data;
			this.execute = input_data.execute;
		} else {
			this.data = input_data as TData;
			this.execute = execute as InteractionExecute;
		}
	}
}

export type ICommandInteractionData = RequiredFields<
	Partial<Pick<CommandInteractionData, 'components' | 'embeds'>> & Pick<CommandInteractionData, 'command'>, 'command'
>;
//TODO make custom component type object interfaces
export class CommandInteractionData { //TODO think of a better name for this class (cant be CommandData as that may conflict with other discordjs classes)
	public command: CommandInteractionContentInput<ICommandObject>;
	public components?: {
		rows?: TODO,
		selectMenus?: CommandInteractionContentInput<Exclude<ActionRowComponentOptions, ButtonComponentData>>[],
		buttons?: CommandInteractionContentInput<ButtonComponentData>[]
	};
	public _embeds?: InteractionEmbeds;

	constructor(input: ICommandInteractionData) {
		this.command = input.command;

		if (input.components !== undefined) {
			this.components = input.components;
		}

		if (input.embeds !== undefined) {
			this.embeds = input.embeds;
		}
	}

	public get embeds() { //TODO fix this and make it autocomplete with all keys inside this._embeds
		type Fields = typeof this._embeds extends string ? string : string;
		let out: {[key in Fields]: (...args: any[]) => EmbedBuilder | Promise<EmbedBuilder>} = this._embeds!
		return this._embeds;
	}
	public set embeds(value: CommandInteractionData['_embeds']) {
		this._embeds = value;
	}
}

const cmd = new CommandInteractionData({
	command: {
		data: {
			name: '',
			description: '',
		},
		async execute(interaction: ChatInputCommandInteraction) {
			// cmd.embeds!.
			return true
		}
	},
	components: {
		selectMenus: [
			{
				data: {
					type: ComponentType.StringSelect,
					customId: '',
					options: []
				},
				async execute(interaction: any) {

				}
			},
		],
		buttons: [
			{
				data: {
					customId: '',
					style: ButtonStyle.Primary,
					type: ComponentType.Button
				},
				async execute(interaction: any) {

				}
			}
		]
	},
	embeds: {
		someEmbed: () => {
			return new EmbedBuilder();
		},
		async otherEmbed(input: string) {
			return new EmbedBuilder({
				title: input
			});
		}
	}
})