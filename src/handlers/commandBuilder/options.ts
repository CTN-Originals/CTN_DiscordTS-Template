import { ApplicationCommandOptionType, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { CommandObjectBase, CommandObjectInput } from '.';


// export type ICommandObjectOptionBase = CommandObjectInput<CommandObjectOptionBase, 'required' | 'autocomplete', 'type'>
export type AnySlashCommandOption = 
SlashCommandStringOption |
SlashCommandIntegerOption |
SlashCommandBooleanOption |
SlashCommandUserOption |
SlashCommandChannelOption |
SlashCommandRoleOption |
SlashCommandMentionableOption |
SlashCommandNumberOption |
SlashCommandAttachmentOption;

export type ICommandObjectOptionBase = CommandObjectInput<
    CommandObjectOptionBase,
    'required' | 'autocomplete',
    'type'
>;

export class CommandObjectOptionBase extends CommandObjectBase {
	public type!: ApplicationCommandOptionType;
	public required: boolean = false;
	public autocomplete?: boolean;

	constructor(input: ICommandObjectOptionBase) {
		super(input);
		this.assignFields(input);
	}

	protected optionBuildBase<T extends AnySlashCommandOption>(builder: T): T {
		builder = this.buildBase(builder);
		builder.setRequired(this.required);

		if (
			this.autocomplete !== undefined &&
			builder.type == (ApplicationCommandOptionType.String || ApplicationCommandOptionType.Number || ApplicationCommandOptionType.Integer)
		) { builder.setAutocomplete(this.autocomplete); }

		return builder;
	}
}

export class CommandObjectStringOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandStringOption());
		return opt;
	}
}
export class CommandObjectIntegerOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandIntegerOption());
		return opt;
	}
}
export class CommandObjectBooleanOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandBooleanOption());
		return opt;
	}
}
export class CommandObjectUserOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandUserOption());
		return opt;
	}
}
export class CommandObjectChannelOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandChannelOption());
		return opt;
	}
}
export class CommandObjectRoleOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandRoleOption());
		return opt;
	}
}
export class CommandObjectMentionableOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandMentionableOption());
		return opt;
	}
}
export class CommandObjectNumberOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandNumberOption());
		return opt;
	}
}
export class CommandObjectAttachmentOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.optionBuildBase(new SlashCommandAttachmentOption());
		return opt;
	}
}
