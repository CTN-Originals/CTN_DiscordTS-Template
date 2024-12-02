import { InteractionContextType, ApplicationIntegrationType, SlashCommandBuilder, Permissions, ApplicationCommandOption } from "discord.js";

import { CommandObjectBase, CommandObjectInput, SubcommandGroupObject, ISubcommandGroupObject, SubcommandObject, ISubcommandObject } from ".";

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

	public subcommandGroups: (SubcommandGroupObject|ISubcommandGroupObject)[] = [];
	public subcommands: (SubcommandObject|ISubcommandObject)[] = [];

	public options: ApplicationCommandOption[] = [];

	/** A substitude for SlashCommandBuilder that allows an object to be put in, instead of the bs .addField() functions...
	 * @param input The object to transform into a command
	*/
	constructor(input: ICommandObject) {
		super(input);
		this.assignFields(input);

		if (this.subcommandGroups.length > 0) {
			for (const group of this.subcommandGroups) {
				if (!group.subcommands || group.subcommands?.length == 0) {
					throw this.onError(`SubommandGroup "${group.name}" does not contain any subcommands`);
				}
			}
		}
		
		if (this.options && this.options.length > 0 && (this.subcommandGroups.length > 0 || this.subcommands.length > 0)) {
			throw this.onError(`Top-Level command "${this.name}" options are populated while subcommand(Group)s are also present.\nSub-command and sub-command group option types are mutually exclusive to all other types`);
		}
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
