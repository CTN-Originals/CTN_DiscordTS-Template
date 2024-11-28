import { InteractionContextType, ApplicationIntegrationType, SlashCommandBuilder, Permissions, ApplicationCommandOption } from "discord.js";

import { CommandObjectBase, CommandObjectInput } from ".";
import { SubcommandGroupObject, ISubcommandGroupObject } from "./subcommandGroup";
import { SubcommandObject, ISubcommandObject } from "./subcommand";

type SlashCommandBuilderFields = 'contexts' | 'default_member_permissions' | 'integration_types' | 'nsfw';
export type ICommandObject = CommandObjectInput<CommandObject, SlashCommandBuilderFields | 'subcommandGroups' | 'subcommands' | 'options'>
export class CommandObject extends CommandObjectBase {
    /** The contexts for this command. */
    public contexts?: InteractionContextType[];
    /** The set of permissions represented as a bit set for the command. */
    public default_member_permissions: Permissions | null | undefined;
    /** The integration types for this command. */
    public integration_types?: ApplicationIntegrationType[];
    /** Whether this command is NSFW. */
    public nsfw: boolean | undefined;

	public subcommandGroups: (SubcommandGroupObject|ISubcommandGroupObject)[] = []
	public subcommands: (SubcommandObject|ISubcommandObject)[] = []

	public options: ApplicationCommandOption[] = [];

	/** A substitude for SlashCommandBuilder that allows an object to be put in, instead of the bs .addField() functions...
	 * @param input The object to transform into a command
	*/
	constructor(input: ICommandObject) {
		super(input);
		this.assignFields(input);
		/* //TODO Checks
			- each field can be validated with its own rules, string length, no symbols in names, etc
			- either/or subcommand(group) lists have items at the same time that options does too, and if so, warn user that the options will be ignored
			- if any subcommandGroups have no subcommands
		*/
	}

	public get build() {
		const cmd = this.resolveOptions(this.buildBase(new SlashCommandBuilder()), this.options);

		if (this.contexts) 						{ cmd.setContexts(this.contexts); }
		if (this.default_member_permissions) 	{ cmd.setDefaultMemberPermissions(this.default_member_permissions); }
		if (this.integration_types) 			{ cmd.setIntegrationTypes(this.integration_types); }
		if (this.nsfw) 							{ cmd.setNSFW(this.nsfw); }
		
		for (const group of this.subcommandGroups) {
			cmd.addSubcommandGroup(((group instanceof SubcommandGroupObject) ? group : new SubcommandGroupObject(group)).build);
		}
		for (const sub of this.subcommands) {
			cmd.addSubcommand(((sub instanceof SubcommandObject) ? sub : new SubcommandObject(sub)).build);
		}

		return cmd
	}
}
