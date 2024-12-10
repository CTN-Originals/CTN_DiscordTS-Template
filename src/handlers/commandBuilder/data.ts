import { AnyComponentBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ChannelType, ChatInputCommandInteraction, ComponentType, EmbedBuilder, MentionableSelectMenuBuilder, RoleSelectMenuBuilder, SelectMenuDefaultValueType, SlashCommandBuilder, UserSelectMenuBuilder } from "discord.js";
import { ICommandObject, AnyComponentObject, IButtonComponentObject, AnySelectMenuComponentBuilder, AnySelectMenuComponentObject, CommandObject } from ".";
import { ButtonComponentObject, ChannelSelectComponentObject, IAnyComponentObject, IAnySelectMenuComponentObject, MentionableSelectComponentObject, RoleSelectComponentObject, StringSelectComponentObject, UserSelectComponentObject } from "./components";

type InteractionExecute = (interaction: ChatInputCommandInteraction) => any|any[]|Promise<any|any[]>;

export class BaseInteractionEmbeds {
	
}

export type CommandInteractionContentInput<
	TData extends (ICommandObject | IAnyComponentObject),
    // Required extends keyof CommandInteractionContent<TData> = 'data' | 'execute'
> = Required<CommandInteractionContent<TData>>;
export class CommandInteractionContent<TData extends (ICommandObject | IAnyComponentObject)> {
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

export type ICommandInteractionComponents = Partial<CommandInteractionComponents>
type ICommandInteractionComponentsBuild = { selectMenus: AnySelectMenuComponentBuilder[], buttons: ButtonBuilder[] };
export class CommandInteractionComponents {
	public selectMenus: CommandInteractionContentInput<IAnySelectMenuComponentObject>[] = [];
	public buttons: CommandInteractionContentInput<IButtonComponentObject>[] = [];

	constructor(input: ICommandInteractionComponents) {
		for (const field in input) {
			this[field] = input[field];
		}
	}

	public build(): ICommandInteractionComponentsBuild {
		const out: ReturnType<typeof this.build> = { selectMenus: [], buttons: [] };

		for (const select of this.selectMenus) {
			let componentBuild: AnySelectMenuComponentBuilder;
			switch (select.data.type) {
				case ComponentType.StringSelect: 		{ componentBuild = new StringSelectComponentObject(select.data).build(); } break;
				case ComponentType.UserSelect: 			{ componentBuild = new UserSelectComponentObject(select.data).build(); } break;
				case ComponentType.RoleSelect: 			{ componentBuild = new RoleSelectComponentObject(select.data).build(); } break;
				case ComponentType.MentionableSelect: 	{ componentBuild = new MentionableSelectComponentObject(select.data).build(); } break;
				case ComponentType.ChannelSelect: 		{ componentBuild = new ChannelSelectComponentObject(select.data).build(); } break;
			}

			out.selectMenus.push(componentBuild);
		}

		for (const button of this.buttons) {
			out.buttons.push(new ButtonComponentObject(button.data).build())
		}

		return out;
	}
}

export type ICommandInteractionData<TEmbeds extends BaseInteractionEmbeds = never> = RequiredFields<
	Partial<Pick<CommandInteractionData<TEmbeds>, 'components' | 'embeds'>> & Pick<CommandInteractionData<TEmbeds>, 'command'>, 'command'
>;

type ICommandInteractionDataBuild = { command: SlashCommandBuilder, components: ICommandInteractionComponentsBuild };
export class CommandInteractionData<TEmbeds extends BaseInteractionEmbeds = never> { //TODO think of a better name for this class (cant be CommandData as that may conflict with other discordjs classes)
	public command: CommandInteractionContentInput<ICommandObject>;
	public components: ICommandInteractionComponents = {};
	public embeds: TEmbeds | undefined

	constructor(input: ICommandInteractionData<TEmbeds>) {
		this.command = input.command;

		if (input.components !== undefined) {
			this.components = input.components;
		}

		if (input.embeds !== undefined) {
			this.embeds = input.embeds;
		}
	}

	public build(): ICommandInteractionDataBuild {
		return {
			command: new CommandObject(this.command.data).build(),
			components: new CommandInteractionComponents(this.components).build()
		}
	}
}

