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
}

export class CommandObjectStringOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandStringOption());
		return opt;
	}
}
export class CommandObjectIntegerOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandIntegerOption());
		return opt;
	}
}
export class CommandObjectBooleanOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandBooleanOption());
		return opt;
	}
}
export class CommandObjectUserOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandUserOption());
		return opt;
	}
}
export class CommandObjectChannelOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandChannelOption());
		return opt;
	}
}
export class CommandObjectRoleOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandRoleOption());
		return opt;
	}
}
export class CommandObjectMentionableOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandMentionableOption());
		return opt;
	}
}
export class CommandObjectNumberOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandNumberOption());
		return opt;
	}
}
export class CommandObjectAttachmentOption extends CommandObjectOptionBase {
	public get build() {
		const opt = this.buildBase(new SlashCommandAttachmentOption());
		return opt;
	}
}
