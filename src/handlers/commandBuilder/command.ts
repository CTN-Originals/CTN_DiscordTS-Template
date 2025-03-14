import type { ApplicationIntegrationType, InteractionContextType, Permissions } from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';

import { BaseCommandObject, BaseExecutableCommandObject, CommandObjectInput, ExecutableCommandObjectInput } from '.';

type SlashCommandBuilderFields = 'contexts' | 'default_member_permissions' | 'integration_types' | 'nsfw';
export type ICommandObject = ExecutableCommandObjectInput<CommandObject, SlashCommandBuilderFields | 'subcommandGroups' | 'subcommands'>
export class CommandObject extends BaseExecutableCommandObject {
	/** The contexts for this command. */
	public contexts?: InteractionContextType[];
	/** The set of permissions represented as a bit set for the command. */
	public default_member_permissions: Permissions | null | undefined;
	/** The integration types for this command. */
	public integration_types?: ApplicationIntegrationType[];
	/** Whether this command is NSFW. */
	public nsfw: boolean | undefined;

	public subcommandGroups: (SubCommandGroupObject|ISubCommandGroupObject)[] = [];
	public subcommands: (SubCommandObject|ISubCommandObject)[] = [];

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

	public build(): SlashCommandBuilder {
		const cmd = this.resolveOptions(this.buildBase(new SlashCommandBuilder()), this.options);

		if (this.contexts) 						{ cmd.setContexts(this.contexts); }
		if (this.default_member_permissions) 	{ cmd.setDefaultMemberPermissions(this.default_member_permissions); }
		if (this.integration_types) 			{ cmd.setIntegrationTypes(this.integration_types); }
		if (this.nsfw) 							{ cmd.setNSFW(this.nsfw); }
		
		for (const group of this.subcommandGroups) {
			cmd.addSubcommandGroup(((group instanceof SubCommandGroupObject) ? group : new SubCommandGroupObject(group)).build());
		}
		for (const sub of this.subcommands) {
			cmd.addSubcommand(((sub instanceof SubCommandObject) ? sub : new SubCommandObject(sub)).build());
		}

		return cmd;
	}
}


export type ISubCommandObject = ExecutableCommandObjectInput<SubCommandObject>
export class SubCommandObject extends BaseExecutableCommandObject {
	constructor(input: ISubCommandObject) {
		super(input);
		this.assignFields(input);
	}

	public build(): SlashCommandSubcommandBuilder {
		const cmd = this.resolveOptions(this.buildBase(new SlashCommandSubcommandBuilder()), this.options);
		return cmd;
	}
}

export type ISubCommandGroupObject = CommandObjectInput<SubCommandGroupObject, 'subcommands'>
export class SubCommandGroupObject extends BaseCommandObject {
	public subcommands: (SubCommandObject|ISubCommandObject)[] = [];

	constructor(input: ISubCommandGroupObject) {
		super(input);
		this.assignFields(input);
	}

	public build(): SlashCommandSubcommandGroupBuilder {
		const cmd = this.buildBase(new SlashCommandSubcommandGroupBuilder());

		for (const sub of this.subcommands) {
			const subObj: SubCommandObject = (sub instanceof SubCommandObject) ? sub : new SubCommandObject(sub);
			cmd.addSubcommand(subObj.build());
		}

		return cmd;
	}
}
