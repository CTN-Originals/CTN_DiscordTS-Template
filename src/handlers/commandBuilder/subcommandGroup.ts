import { SlashCommandSubcommandGroupBuilder } from "discord.js";
import { CommandObjectInput, CommandObjectBase } from ".";
import { SubcommandObject, ISubcommandObject } from "./subcommand";

export type ISubcommandGroupObject = CommandObjectInput<SubcommandGroupObject, 'subcommands'>
export class SubcommandGroupObject extends CommandObjectBase {
	public subcommands: (SubcommandObject|ISubcommandObject)[] = []

	constructor(input: ISubcommandGroupObject) {
		super(input);
		this.assignFields(input);
	}

	public get build(): SlashCommandSubcommandGroupBuilder {
		const cmd = this.buildBase(new SlashCommandSubcommandGroupBuilder());

		for (const sub of this.subcommands) {
			const subObj: SubcommandObject = (sub instanceof SubcommandObject) ? sub : new SubcommandObject(sub);
			cmd.addSubcommand(subObj.build);
		}

		return cmd;
	}
}
