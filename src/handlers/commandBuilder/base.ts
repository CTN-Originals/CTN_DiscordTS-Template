import { LocalizationMap, SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, ApplicationCommandOption, ApplicationCommandOptionType, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { nameAllowedCharacters } from ".";
import { 
	CommandObjectAttachmentOption,
	CommandObjectBooleanOption,
	CommandObjectChannelOption,
	CommandObjectIntegerOption,
	CommandObjectMentionableOption,
	CommandObjectNumberOption,
	CommandObjectRoleOption,
	CommandObjectStringOption,
	CommandObjectUserOption,
	AnySlashCommandOption
} from ".";
import { EmitError } from "../../events";

export type AnySlashCommandBuilder = 
	SlashCommandBuilder | 
	SlashCommandSubcommandBuilder | 
	SlashCommandSubcommandGroupBuilder;

export type RequiredBaseFields = 'name' | 'description';
export type OptionalBaseFields = 'name_localizations' | 'description_localizations';

export type CommandObjectInput<
    T extends CommandObjectBase,
    Optional extends keyof T = never,
    Required extends keyof T = never
> = RequiredFields<
    Partial<Pick<T, Optional | OptionalBaseFields>> & Pick<T, RequiredBaseFields | Required>,
    RequiredBaseFields | Required
>;

export type ICommandObjectBase = CommandObjectInput<CommandObjectBase>
export class CommandObjectBase {
	/** The name of this command.
	 * @minmax 1-32 
	 * @containing no capital letters, spaces, or symbols other than `-` and `_`
	*/
    public name: string;
    /** The description of this command.
	 * @minmax 1-100
	*/
    public description: string;
	/** The name localizations of this command. */
	public name_localizations?: LocalizationMap;
	/** The description localizations of this command. */
	public description_localizations?: LocalizationMap;

	constructor(input: ICommandObjectBase) {
		this.name = input.name;
		this.description = input.description;

		if (this.name.length < 1 || this.name.length > 32) {
			throw this.onError(`Command name does not fit in length range 1 - 32\nInput: ${this.name}`)
		}
		if (this.description.length < 1 || this.description.length > 100) {
			throw this.onError(`Command description does not fit in length range 1 - 100\nInput: ${this.description}`)
		}
		
		for (const char of this.name) {
			if (!nameAllowedCharacters.includes(char)) {
				throw this.onError(`Command name "${this.name}" contains illigal character "${char}"`)
			}
		}
	}

	protected assignFields(input: CommandObjectInput<CommandObjectBase, any>) {
		for (const field in input) {
			this[field] = input[field];
		}
	}

	protected buildBase<T extends AnySlashCommandBuilder | AnySlashCommandOption>(builder: T): T {
		const cmd = builder.setName(this.name).setDescription(this.description) as T;

		if (this.name_localizations) 			{ cmd.setNameLocalizations(this.name_localizations); }
		if (this.description_localizations) 	{ cmd.setDescriptionLocalizations(this.description_localizations); }

		return cmd;
	}

	protected resolveOptions<T extends Exclude<AnySlashCommandBuilder, SlashCommandSubcommandGroupBuilder>>(builder: T, options: ApplicationCommandOption[]): T {
		for (const opt of options) {
			switch (opt.type) {
				case ApplicationCommandOptionType.String: 		builder.addStringOption(new CommandObjectStringOption(opt).build); break;
				case ApplicationCommandOptionType.Integer: 		builder.addIntegerOption(new CommandObjectIntegerOption(opt).build); break;
				case ApplicationCommandOptionType.Boolean: 		builder.addBooleanOption(new CommandObjectBooleanOption(opt).build); break;
				case ApplicationCommandOptionType.User: 		builder.addUserOption(new CommandObjectUserOption(opt).build); break;
				case ApplicationCommandOptionType.Channel: 		builder.addChannelOption(new CommandObjectChannelOption(opt).build); break;
				case ApplicationCommandOptionType.Role: 		builder.addRoleOption(new CommandObjectRoleOption(opt).build); break;
				case ApplicationCommandOptionType.Mentionable: 	builder.addMentionableOption(new CommandObjectMentionableOption(opt).build); break;
				case ApplicationCommandOptionType.Number: 		builder.addNumberOption(new CommandObjectNumberOption(opt).build); break;
				case ApplicationCommandOptionType.Attachment: 	builder.addAttachmentOption(new CommandObjectAttachmentOption(opt).build); break;
				default: break;
			}
		}

		return builder
	}

	protected onError(message: string): string {
		const err = new Error(message)
		EmitError(err);
		return err.message;
	}
}
