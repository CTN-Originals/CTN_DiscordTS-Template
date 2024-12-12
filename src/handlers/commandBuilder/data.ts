import { AnySelectMenuInteraction, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ChannelType, ChatInputCommandInteraction, ComponentType, EmbedBuilder, Interaction, SlashCommandBuilder } from "discord.js";
import {
	ICommandObject,
	IButtonComponentObject,
	AnySelectMenuComponentBuilder,
	CommandObject,

	ButtonComponentObject,
	ChannelSelectComponentObject,
	IAnyComponentObject,
	IAnySelectMenuComponentObject,
	MentionableSelectComponentObject,
	RoleSelectComponentObject,
	StringSelectComponentObject,
	UserSelectComponentObject,
	AnyBuilder
} from ".";

type InteractionExecute<TInteraction extends Interaction = Interaction> = (interaction: TInteraction) => any|Promise<any>;

type CommandInteractionContentInput<TData extends (ICommandObject | IAnyComponentObject), TInteraction extends Interaction = Interaction> = Required<CommandInteractionContent<TData, TInteraction>>;
export abstract class CommandInteractionContent<TData extends (ICommandObject | IAnyComponentObject), TInteraction extends Interaction = Interaction> {
	public data: TData;
	public execute: InteractionExecute<TInteraction>;

	constructor(input: CommandInteractionContentInput<TData, TInteraction>);
	constructor(data: TData, execute: InteractionExecute<TInteraction>);
	constructor(input_data: CommandInteractionContentInput<TData, TInteraction> | TData, execute?: InteractionExecute<TInteraction>) {
		if (input_data instanceof CommandInteractionContent) {
			this.data = input_data.data;
			this.execute = input_data.execute;
		} else {
			this.data = input_data as TData;
			this.execute = execute as InteractionExecute<TInteraction>;
		}
	}
}

//#region Base Classes
/** @link Source: https://stackoverflow.com/a/70510920 */
type CheckFields<T, TField> = {
	[K in keyof T]: T[K] extends Function ?
	any : TField
}

export type ICommandField = CommandInteractionContentInput<ICommandObject, ChatInputCommandInteraction>;

export type IButtonCollectionField = CommandInteractionContentInput<IButtonComponentObject, ButtonInteraction>
export type IButtonCollection<T> = CheckFields<T, IButtonCollectionField>

export type ISelectMenuCollectionField = CommandInteractionContentInput<IAnySelectMenuComponentObject, AnySelectMenuInteraction>
export type ISelectMenuCollection<T> = CheckFields<T, ISelectMenuCollectionField>

export class BaseComponentCollection<TData extends IButtonComponentObject | IAnySelectMenuComponentObject> {
	public asArray() {
		const out: CommandInteractionContentInput<TData>[] = []
		for (const field in this) {
			out.push(this[field] as CommandInteractionContentInput<TData>)
		}

		return out;
	}
}
export class BaseButtonCollection extends BaseComponentCollection<IButtonComponentObject> {
	public build() {
		const out: ButtonBuilder[] = [];

		for (const button of this.asArray()) {
			out.push(new ButtonComponentObject(button.data).build())
		}

		return out;
	}
}
export class BaseSelectMenuCollection extends BaseComponentCollection<IAnySelectMenuComponentObject> {
	public build() {
		const out: AnySelectMenuComponentBuilder[] = [];
		
		for (const select of this.asArray()) {
			let componentBuild: AnySelectMenuComponentBuilder;
			switch (select.data.type) {
				case ComponentType.StringSelect: 		{ componentBuild = new StringSelectComponentObject(select.data).build(); } break;
				case ComponentType.UserSelect: 			{ componentBuild = new UserSelectComponentObject(select.data).build(); } break;
				case ComponentType.RoleSelect: 			{ componentBuild = new RoleSelectComponentObject(select.data).build(); } break;
				case ComponentType.MentionableSelect: 	{ componentBuild = new MentionableSelectComponentObject(select.data).build(); } break;
				case ComponentType.ChannelSelect: 		{ componentBuild = new ChannelSelectComponentObject(select.data).build(); } break;
			}

			out.push(componentBuild);
		}

		return out;
	}
}
export class BaseEmbedCollection {}
//#endregion

type ICommandInteractionData<
	TButtons extends BaseButtonCollection = never,
	TSelectMenus extends BaseSelectMenuCollection = never,
	TEmbeds extends BaseEmbedCollection = never
> = RequiredFields<
	Partial<Pick<CommandInteractionData<TButtons, TSelectMenus, TEmbeds>, 'buttons' | 'selectMenus' | 'embeds'>> & Pick<CommandInteractionData<TButtons, TSelectMenus, TEmbeds>, 'command'>, 'command'
>;

type ICommandInteractionDataBuild = { command: SlashCommandBuilder, buttons: ButtonBuilder[], selectMenus: AnySelectMenuComponentBuilder[] };
type IOptionalCollection<Field, Extend> = Field extends Extend ? Field : undefined
type IOptionalCollectionObject<Field, Extend> = Field extends Extend ? Omit<Field, 'asArray' | 'build'> : undefined
export class CommandInteractionData<
	TButtons extends BaseButtonCollection = never,
	TSelectMenus extends BaseSelectMenuCollection = never,
	TEmbeds extends BaseEmbedCollection = never
> {
	public command: ICommandField;
	private _buttons?: TButtons;
	private _selectMenus?: TSelectMenus;
	private _embeds?: TEmbeds;

	constructor(input: ICommandInteractionData<TButtons, TSelectMenus, TEmbeds>) {
		this.command = input.command;

		if (input.buttons) { this._buttons = input.buttons as IOptionalCollection<TButtons, BaseButtonCollection>; }
		if (input.selectMenus) { this._selectMenus = input.selectMenus as IOptionalCollection<TSelectMenus, BaseSelectMenuCollection>; }
		if (input.embeds) { this._embeds = input.embeds as IOptionalCollection<TEmbeds, BaseEmbedCollection> }
	}

	//#region Getters
	public get buttons(): IOptionalCollectionObject<TButtons, BaseButtonCollection> {
		return this._buttons as IOptionalCollectionObject<TButtons, BaseButtonCollection>;
	}
	public get selectMenus(): IOptionalCollectionObject<TSelectMenus, BaseSelectMenuCollection> {
		return this._selectMenus as IOptionalCollectionObject<TSelectMenus, BaseSelectMenuCollection>;
	}
	public get embeds(): IOptionalCollectionObject<TEmbeds, BaseEmbedCollection> {
		return this._embeds as IOptionalCollectionObject<TEmbeds, BaseEmbedCollection>;
	}

	public get buttonCollection(): IOptionalCollection<TButtons, BaseButtonCollection> {
		return this._buttons as IOptionalCollection<TButtons, BaseButtonCollection>;
	}
	public get selectMenuCollection(): IOptionalCollection<TSelectMenus, BaseSelectMenuCollection> {
		return this._selectMenus as IOptionalCollection<TSelectMenus, BaseSelectMenuCollection>;
	}
	public get embedCollection(): IOptionalCollection<TEmbeds, BaseEmbedCollection> {
		return this._embeds as IOptionalCollection<TEmbeds, BaseEmbedCollection>;
	}
	//#endregion

	//#region Setters
	public set buttons(value: TButtons) {
		this._buttons = value;
	}
	public set selectMenus(value: TSelectMenus) {
		this._selectMenus = value;
	}
	public set embeds(value: TEmbeds) {
		this._embeds = value;
	}
	//#endregion

	//#region Build
	public buildCommand(): ICommandInteractionDataBuild['command'] {
		return new CommandObject(this.command.data).build();
	}
	public buildButtons(): ICommandInteractionDataBuild['buttons'] {
		return this._buttons?.build() ?? [];
	}
	public buildSelectMenus(): ICommandInteractionDataBuild['selectMenus'] {
		return this._selectMenus?.build() ?? [];
	}

	public build(): ICommandInteractionDataBuild {
		return {
			command: this.buildCommand(),
			buttons: this.buildButtons() ,
			selectMenus: this.buildSelectMenus(),
		}
	}
	//#endregion
}

//#region Test
class ButtonCollection extends BaseButtonCollection implements IButtonCollection<ButtonCollection> {
	public but: IButtonCollectionField = {
		data: {
			customId: 'jgyj',
			label: 'awd'
		},
		execute: async function (interaction: ButtonInteraction) {
			
		}
	}
}
class SelectMenuCollection extends BaseSelectMenuCollection implements ISelectMenuCollection<SelectMenuCollection> {
	public strSel: ISelectMenuCollectionField = {
		data: {
			type: ComponentType.StringSelect,
			customId: 'fes',
		},
		async execute(interaction: any) { }
	}
	
	public chanSel: ISelectMenuCollectionField = {
		data: {
			type: ComponentType.ChannelSelect,
			customId: 'gdrg',
			
			channelTypes: [
				ChannelType.GuildText,
				ChannelType.PublicThread
			]
		},
		async execute(interaction: any) { }
	}
	
	private roleSel: ISelectMenuCollectionField = {
		data: {
			type: ComponentType.RoleSelect,
			customId: 'rol',
		},
		async execute(interaction: any) { }

	}
}

class EmbedCollection extends BaseEmbedCollection {
	public func() {return new EmbedBuilder()}
	public get someEmb() {
		return new EmbedBuilder();
	}
	public someEmbed = () => {
		return new EmbedBuilder();
	}
	public async otherEmbed(input: string) {
		return new EmbedBuilder({
			title: input
		});
	}
}

const cmd = new CommandInteractionData<ButtonCollection, SelectMenuCollection, EmbedCollection>({
	command: {
		data: {
			name: 'a',
			description: 'awd',
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: 'opt_ons',
					description: 'awd something desc',
				}
			]
		},
		async execute(interaction: ChatInputCommandInteraction) {
			// cmd.embeds
			return true
		}
	},
	buttons: new ButtonCollection(),
	selectMenus: new SelectMenuCollection(),
	embeds: new EmbedCollection()
})

//#endregion
