import { AnyComponentBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ChatInputCommandInteraction, ComponentType, EmbedBuilder, MentionableSelectMenuBuilder, RoleSelectMenuBuilder, SelectMenuDefaultValueType, SlashCommandBuilder, UserSelectMenuBuilder } from "discord.js";
import { ICommandObject, AnyComponentObject, IButtonComponentObject, AnySelectMenuComponentBuilder, AnySelectMenuComponentObject, CommandObject } from ".";
import { ButtonComponentObject, ChannelSelectComponentObject, IAnyComponentObject, IAnySelectMenuComponentObject, MentionableSelectComponentObject, RoleSelectComponentObject, StringSelectComponentObject, UserSelectComponentObject } from "./components";

type InteractionExecute<TInteraction extends Interaction = Interaction> = (interaction: TInteraction) => any|Promise<any>;

type CommandInteractionContentInput<TData extends (ICommandObject | IAnyComponentObject), TInteraction extends Interaction = Interaction> = Required<CommandInteractionContent<TData, TInteraction>>;
export class CommandInteractionContent<TData extends (ICommandObject | IAnyComponentObject), TInteraction extends Interaction = Interaction> {
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

export type InteractionButtonField = CommandInteractionContentInput<IButtonComponentObject, ButtonInteraction>
export type InteractionButtonFields<T> = CheckFields<T, InteractionButtonField>

export type InteractionSelectMenuField = CommandInteractionContentInput<IAnySelectMenuComponentObject, AnySelectMenuInteraction>
export type InteractionSelectMenuFields<T> = CheckFields<T, InteractionSelectMenuField>

export class BaseInteractionComponents<TData extends IButtonComponentObject | IAnySelectMenuComponentObject> {
	public asArray() {
		const out: CommandInteractionContentInput<TData>[] = []
		for (const field in this) {
			out.push(this[field] as CommandInteractionContentInput<TData>)
		}

		return out;
	}
}
export class BaseInteractionButtons extends BaseInteractionComponents<IButtonComponentObject> {
	public build() {
		const out: ButtonBuilder[] = [];

		for (const button of this.asArray()) {
			out.push(new ButtonComponentObject(button.data).build())
		}

		return out
	}
}
export class BaseInteractionSelectMenus extends BaseInteractionComponents<IAnySelectMenuComponentObject> {
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

		return out
	}
}
export class BaseInteractionEmbeds {}
//#endregion

type ICommandInteractionData<
	TButtons extends BaseInteractionButtons = never,
	TSelectMenus extends BaseInteractionSelectMenus = never,
	TEmbeds extends BaseInteractionEmbeds = never
> = RequiredFields<
	Partial<Pick<CommandInteractionData<TButtons, TSelectMenus, TEmbeds>, 'buttons' | 'selectMenus' | 'embeds'>> & Pick<CommandInteractionData<TButtons, TSelectMenus, TEmbeds>, 'command'>, 'command'
>;

type ICommandInteractionDataBuild = { command: SlashCommandBuilder, buttons: ButtonBuilder[], selectMenus: AnySelectMenuComponentBuilder[] };
export class CommandInteractionData<
	TButtons extends BaseInteractionButtons = never,
	TSelectMenus extends BaseInteractionSelectMenus = never,
	TEmbeds extends BaseInteractionEmbeds = never
> { //TODO think of a better name for this class (cant be CommandData as that may conflict with other discordjs classes)
	public command: CommandInteractionContentInput<ICommandObject, ChatInputCommandInteraction>;
	// public components: ICommandInteractionComponents = {};
	private _buttons?: TButtons;
	private _selectMenus?: TSelectMenus;
	public embeds: TEmbeds | undefined

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

	public build(): ICommandInteractionDataBuild {
		return {
			command: new CommandObject(this.command.data).build(),
			buttons: this._buttons?.build() ?? [],
			selectMenus: this._selectMenus?.build() ?? [],
		}
	}
}

//#region Test
class InteractionButtons extends BaseInteractionButtons implements InteractionButtonFields<InteractionButtons> {
	public but: InteractionButtonField = {
		data: {
			customId: 'jgyj',
		},
		execute: async function (interaction: ButtonInteraction) {
			
		}
	}
}
class InteractionSelectMenus extends BaseInteractionSelectMenus implements InteractionSelectMenuFields<InteractionSelectMenus> {
	public strSel: InteractionSelectMenuField = {
		data: {
			type: ComponentType.StringSelect,
			customId: 'fes',
		},
		async execute(interaction: any) { }
	}
	
	public chanSel: InteractionSelectMenuField = {
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
	
	private roleSel: InteractionSelectMenuField = {
		data: {
			type: ComponentType.RoleSelect,
			customId: 'rol',
		},
		async execute(interaction: any) { }

	}
}

class InteractionEmbeds extends BaseInteractionEmbeds {
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

export const cmd = new CommandInteractionData<InteractionButtons, InteractionSelectMenus, InteractionEmbeds>({
	command: {
		data: {
			name: 'a',
			description: 'awd',
		},
		async execute(interaction: ChatInputCommandInteraction) {
			// cmd.embeds
			return true
		}
	},
	buttons: new InteractionButtons(),
	selectMenus: new InteractionSelectMenus,
	embeds: new InteractionEmbeds()
})
//#endregion
