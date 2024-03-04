import { InteractionReplyOptions, Message, MessageEditOptions, MessageFlags, MessageReplyOptions, Snowflake, TextBasedChannel } from "discord.js";

import { TODO } from "../@types";
import { cons } from "..";
import { devEnvironment } from "../data";
import { EmitError } from "../events";
import { ErrorObject } from "../handlers/errorHandler";

import { ISimBaseInteraction, SimBaseInteraction } from ".";

export interface ISimCommandInteraction extends ISimBaseInteraction {
	commandName: string,
}
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

export class SimCommandInteraction extends SimBaseInteraction {
	public command: TODO;
	public commandName: string;
	public commandId?: Snowflake;
	public commandType?: number;
	public commandGuildId?: Snowflake;
	public deferred: boolean;
	public replied: boolean;
	public ephemeral?: boolean;
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

	//#region Emulated methods (as close to the real deal as possible)
	/** 
	 * @param {boolean} ephermal Whether the reply is ephemeral
	 * @returns {Promise<true | ErrorObject>}
	 */
	async deferReply(ephermal?: boolean): Promise<true | ErrorObject> {
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

	/**
	 * @param {string | ISimInteractionReplyContent} replyContent The content to reply with
	 * @returns {Promise<Message|boolean|ErrorObject>} True if the message was sent or retruns the message if options.fetchReply is true
	*/
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

	/**
	 * @param {string | ISimInteractionReplyContent} replyContent The content to reply with
	 * @returns {Promise<Message|boolean|ErrorObject>} True if the message was sent or retruns the message if options.fetchReply is true
	*/
	async editReply(replyContent: string|ISimInteractionReplyContent): Promise<Message|boolean|ErrorObject> {
		const content = await this.validateReply((this.replied), replyContent);
		if (content instanceof ErrorObject) return content;

		const target = (content.options?.message) ? ((typeof this.options.message === 'string') ? this.fetchReply(content.options.message as Snowflake) : content.options.message as Message) : this._replyMessage
		const message = await this.sendMessage(content, target, true);
		this._replyMessage = message;

		return (content.options?.fetchReply) ? this.fetchReply() ?? false : !!(message);
	}

	/**
	 * @param {string | Snowflake} message The message to fetch ('@original' for the original reply message)
	 * @returns {Message|undefined} The message that was fetched 
	*/
	fetchReply(message: string|Snowflake = '@original'): Message|undefined {
		if (message === '@original' && this._replyMessage !== undefined) return this._replyMessage;
		return this._followUpMessages.find(m => m.id === message);
	}
	//#endregion

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