import { ApplicationCommandOption, SlashCommandSubcommandBuilder } from "discord.js";
import { CommandObjectBase, CommandObjectInput } from ".";

export type ISubcommandObject = CommandObjectInput<SubcommandObject, 'options'>
export class SubcommandObject extends CommandObjectBase {
	public options: ApplicationCommandOption[] = [];

	constructor(input: ISubcommandObject) {
		super(input);
		this.assignFields(input);
	}

	public get build(): SlashCommandSubcommandBuilder {
		const cmd = this.resolveOptions(this.buildBase(new SlashCommandSubcommandBuilder()), this.options);
		return cmd;
	}
}
