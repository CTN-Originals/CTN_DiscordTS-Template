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
export class CommandInteractionData<
	TButtons extends BaseButtonCollection = never,
	TSelectMenus extends BaseSelectMenuCollection = never,
	TEmbeds extends BaseEmbedCollection = never
> { //TODO think of a better name for this class (cant be CommandData as that may conflict with other discordjs classes)
	public command: CommandInteractionContentInput<ICommandObject, ChatInputCommandInteraction>;
	// public components: ICommandInteractionComponents = {};
	private _buttons?: TButtons;
	private _selectMenus?: TSelectMenus;
	public embeds?: TEmbeds

	constructor(input: ICommandInteractionData<TButtons, TSelectMenus, TEmbeds>) {
		this.command = input.command;

		if (input.buttons) { this._buttons = input.buttons as TButtons; }
		if (input.selectMenus) { this._selectMenus = input.selectMenus as TSelectMenus; }
		if (input.embeds) { this.embeds = input.embeds; }
	}

	public set buttons(value: TButtons) {
		this._buttons = value;
	}
	public set selectMenus(value: TSelectMenus) {
		this._selectMenus = value;
	}

	public get buttons(): Omit<TButtons, 'asArray' | 'build'> | undefined {
		return this._buttons;
	}
	public get selectMenus(): Omit<TSelectMenus, 'asArray' | 'build'> | undefined {
		return this._selectMenus;
	}

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
