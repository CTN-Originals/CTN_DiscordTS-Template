import {
	APIGuildMember, APIInteractionGuildMember,
	BaseChannel, BaseGuild, BaseInteraction,
	BaseMessageOptions,
	BitFieldResolvable,
	Client, CommandInteraction, CommandInteractionOptionResolver, 
	Component, 
	DiscordjsErrorCodes, 
	EmbedBuilder, Events, 
	Guild, GuildBasedChannel, GuildChannel,
	GuildMember, GuildMemberFlags,
	InteractionReplyOptions,
	Message,
	MessageEditOptions,
	MessageFlags,
	MessagePayload,
	MessagePayloadOption,
	MessageReplyOptions,
	Routes,
	Snowflake,
	SnowflakeUtil,
	TextBasedChannel,
	TextChannel,
	ThreadChannel,
	User, UserFlagsBitField
} from "discord.js";
import { InteractionResponses } from "discord.js/src/structures/interfaces/InteractionResponses";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";

import { cons } from "..";
import { EmitError, customEvents } from "../events";
import { TODO } from "../@types";
import { devEnvironment } from "../data";
import { ErrorObject } from "./errorHandler";

export interface ISimBaseInteraction {
	client: Client,
	user: User,
	type?: number,
	guild?: BaseGuild|null,
	member?: GuildMember|APIInteractionGuildMember|null
	channel?: BaseChannel|null,
}

export interface ISimCommandInteraction extends ISimBaseInteraction {
	commandName: string,
}
//TODO add all interaction interfaces

interface ISimInteractionReplyOptions extends InteractionReplyOptions, Omit<MessageEditOptions, 'flags'> {
	content?: string,
	flags?: InteractionReplyOptions['flags'],
	message?: Message|Snowflake,
}
interface ISimInteractionReplyContent extends MessageReplyOptions {
	// content?: string,
	ephemeral?: boolean,
	// embeds?: EmbedBuilder[],
	// components: BaseMessageOptions['components'],
	// flags?: number[],
	options?: ISimInteractionReplyOptions,
};

export const defaultBaseInteractionArgs: ISimBaseInteraction = {
	client: devEnvironment.client!,
	user: devEnvironment.user!,
	type: 2,
	guild: devEnvironment.guild,
	member: devEnvironment.member,
	channel: devEnvironment.channel,
}
export async function init() {
	defaultBaseInteractionArgs.client = devEnvironment.client as Client;
	defaultBaseInteractionArgs.user = devEnvironment.user as User;
	defaultBaseInteractionArgs.type = 2;
	defaultBaseInteractionArgs.guild = devEnvironment.guild as Guild;
	defaultBaseInteractionArgs.member = devEnvironment.member as GuildMember|APIInteractionGuildMember;
	defaultBaseInteractionArgs.channel = devEnvironment.channel as BaseChannel;

	cons.logDefault('Simulator ready', defaultBaseInteractionArgs);
}

export class SimBaseInteraction extends BaseInteraction {
	constructor(client: Client, user: User);
	constructor(args?: Partial<ISimBaseInteraction>);
	constructor(args?: Partial<ISimBaseInteraction>|Client, user?: User) {
		if (!defaultBaseInteractionArgs.client) init();

		if (!args) args = defaultBaseInteractionArgs as ISimBaseInteraction;
		else if (args instanceof Client) args = {client: args, user: user as User};
		else {
			for (const [key, value] of Object.entries(defaultBaseInteractionArgs)) {
				if (typeof args[key as keyof ISimBaseInteraction] === undefined) {
					(args as any)[key] = value;
				}
			}
		}

		const client = args.client as Client<true> || devEnvironment.client;

		const snowflake = SnowflakeUtil.generate()
		const data: RawInteractionData = {
			id: snowflake.toString() as RawInteractionData['id'], //? This is a unique id for the interaction
			application_id: client.application?.id as RawInteractionData['application_id'], //? This is the bot's application id
			user: args.user as RawInteractionData['user'], //? This is the user that triggered the interaction
			type: args.type as RawInteractionData['type'], //? 2 is a command interaction type
			// token: process.env.TOKEN as RawInteractionData['token'], //? This is a token for the interaction
			token: 'mock-token' as RawInteractionData['token'], //? This is a token for the interaction
		} as RawInteractionData;

		if (args.guild) {
			data.guild_id = args.guild?.id;
			if (!args.member) args.member = defaultBaseInteractionArgs.member as APIInteractionGuildMember;
			
			data.member = {
				user: args.user as APIGuildMember['user'],
				roles: args.member.roles as APIGuildMember['roles'],
				premium_since: null,
				permissions: '0',
				pending: args.member.pending,
				nick: (args.member instanceof GuildMember) ? args.member.nickname : args.member.nick, //?? this is stupid... why is it either nickname or nick?
				mute: false,
				joined_at: new Date(SnowflakeUtil.timestampFrom(args.user?.id!)).toISOString() as APIGuildMember['joined_at'],
				is_pending: false,
				deaf: false,
				avatar: args.member.user.avatar as APIGuildMember['avatar'],
				flags: args.member.user.flags as UserFlagsBitField|GuildMemberFlags,
			} as APIInteractionGuildMember;

			if (!args.channel) {
				args.channel = defaultBaseInteractionArgs.channel as BaseChannel;
			}
		}
		data.channel = args.channel as RawInteractionData['channel'];
		
		super(client as Client<true>, data as RawInteractionData);

		if (this.member) {
			/* //? This is a hack to avoid an error when the member is updated and discordjs calls member._roles.slice()
			! clone._roles = this._roles.slice(); TypeError: this._roles.slice is not a function */
			this.member['_roles']['slice'] = () => {return this.member!['roles']};
		}
	}

	public simulate(): any {
		return this.client.emit(Events.InteractionCreate as string, this);
	}
}

//?? maybe try again later to impliment it like this: https://stackoverflow.com/questions/26948400/typescript-how-to-extend-two-classes
export class SimCommandInteraction extends SimBaseInteraction {
	public command: TODO;
	public commandName: TODO;
	public commandId: TODO;
	public commandType: TODO;
	public commandGuildId: TODO;
	public deferred: boolean;
	public replied: boolean;
	public ephemeral: boolean|undefined;
	public options: TODO;
	public webhook: TODO;

	public interaction: TODO; // Interaction<CacheType>;
	// Add the missing properties here

	private _replyMessage: Message|undefined;
	private _followUpMessages: Message[];
	
	constructor(args: ISimCommandInteraction) {
		super(args);

		this.commandName = args.commandName;

		this.deferred = false;
		this.replied = false;
		
		this._followUpMessages = [];

		if (super.inGuild()) {
			this.getGuildCommandData(this.commandName);
		}
	}

	async deferReply(ephermal?: boolean) {
		if (this.deferred || this.replied) {
			return await EmitError(new Error('Interaction has already been deferred or replied'), this);
		}
		this.deferred = true;
		this.ephemeral = ephermal || false;
		return true;
	}

	/** 
	 * @param {string | ISimInteractionReplyContent} replyContent The content to reply with
	 * @returns {Promise<Message|boolean|ErrorObject>}
	*/
	async reply(replyContent: string | ISimInteractionReplyContent): Promise<Message|boolean|ErrorObject> {
		const content = await this.validateReply((!this.deferred && !this.replied), replyContent);
		if (content instanceof ErrorObject) return content;

		const message = await this.sendMessage(content);
		this.replied = !!(message);
		this._replyMessage = message;

		return (content.options?.fetchReply) ? this.fetchReply() ?? false : this.replied;
	}

	async followUp(replyContent: string|ISimInteractionReplyContent): Promise<Message|boolean|ErrorObject> {
		const content = await this.validateReply((this.deferred || this.replied), replyContent);
		if (content instanceof ErrorObject) return content;

		if (this.deferred) {
			//! Follow up messages can not be sent if the interaction didnt actually happen due to it being a simulation
			//? If the interaction was deferred, this will print in the console as a follow up message to let me know it has been sent
			cons.log('[fg=green]followUp[/>]: ' + `[fg=orange]/${this.commandName}[/>] was deferred, follow up message:`, content.content, content.embeds);
			return true;
		}
		const message = await this.sendMessage(content, this._replyMessage, false);
		this._followUpMessages.push(message);

		return (content.options?.fetchReply) ? this.fetchReply(message.id) ?? false : !!(message);
	}

	async editReply(replyContent: string|ISimInteractionReplyContent): Promise<Message|boolean|ErrorObject> {
		const content = await this.validateReply((this.replied), replyContent);
		if (content instanceof ErrorObject) return content;

		const target = (content.options?.message) ? ((typeof this.options.message === 'string') ? this.fetchReply(content.options.message as Snowflake) : content.options.message as Message) : this._replyMessage
		const message = await this.sendMessage(content, target, true);
		this._replyMessage = message;

		return (content.options?.fetchReply) ? this.fetchReply() ?? false : !!(message);
	}

	fetchReply(message: string|Snowflake = '@original'): Message|undefined {
		if (message === '@original' && this._replyMessage !== undefined) return this._replyMessage;
		return this._followUpMessages.find(m => m.id === message);
	}

	//#region private methods
	private async getGuildCommandData(name: string) {
		for (const commandData of devEnvironment.restCommands!) {
			if (commandData.name === name) {
				this.command = commandData;
				this.commandId = commandData.id;
				this.commandType = commandData.type;
				this.commandGuildId = commandData.guild_id;

				break;
			}
		}
	}
	
	private async validateReply(condition: boolean, replyContent: string|ISimInteractionReplyContent): Promise<ISimInteractionReplyContent|ErrorObject> {
		if (!condition) {
			return await EmitError(new Error('Interaction reply conditions were not met'), this);
		}
		else if (!this.isRepliable()) {
			return await EmitError(new Error('Interaction can not be replied to'), this);
		}
		this.ephemeral = (typeof replyContent === 'string') ? false : replyContent.ephemeral || false;

		return (typeof replyContent === 'string') ? {
			content: replyContent,
			ephemeral: this.ephemeral,
			embeds: [],
			components: [],
			flags: [],
			options: {},
		} : {
			content: replyContent.content,
			ephemeral: this.ephemeral,
			embeds: replyContent.embeds,
			components: replyContent.components,
			flags: replyContent.flags || [],
			options: replyContent.options || {},
		} as ISimInteractionReplyContent;
	}

	private async sendMessage(content: ISimInteractionReplyContent, target?: TextBasedChannel|Message, update: boolean = true): Promise<Message<boolean>> {
		if (!target) target = this.channel as TextBasedChannel;

		if (this.ephemeral) {
			//? add a silent flag to the reply to indicate that this is an ephemeral message
			content.flags = [MessageFlags.SuppressNotifications];
		}

		//? Mask any user mentions in the content with ticks (`) to prevent them from pinging the user
		content.content = content.content?.replace(/<@!?(\d+)>/g, '`$1`');

		//?? Does this work if the interaction is not in a guild (dm)?
		return (target instanceof Message) ? (
			(update) ? target.edit(content as MessageEditOptions) : target.reply(content)
		) : target.send(content);
	}
	//#endregion
}