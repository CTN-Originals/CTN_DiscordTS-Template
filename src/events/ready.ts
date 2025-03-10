import type { Client, ComponentType, EmbedBuilder, Guild, Interaction, Message } from 'discord.js'
import { Events, InteractionType, Routes, TextChannel } from 'discord.js'
import 'dotenv/config'

import { ConsoleInstance } from 'better-console-utilities'

import { DevEnvironment, GeneralData } from '../data'

import { EmitError } from '.'


// import ErrorHandler from '../handlers/errorHandler';

const thisConsole = new ConsoleInstance()

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client, ...args: any[]) {
		thisConsole.log(`Logged in as ${client.user?.tag}!\n`)

		if (GeneralData.development) {
			DevEnvironment.client = client
			// devEnvironment.memberList = devGuildMembers as Collection<string, GuildMember>;

			DevEnvironment.guild = client.guilds.cache.get(process.env.DEV_GUILD_ID!)
			DevEnvironment.user = await client.users.fetch(process.env.DEV_TEST_USER_ID!)
			DevEnvironment.member = DevEnvironment.memberList.get(process.env.DEV_TEST_USER_ID!)
			DevEnvironment.channel = DevEnvironment.guild?.channels.cache.get(process.env.DEV_TEST_CHANNEL_ID!) as TextChannel

			DevEnvironment.restCommands = await client.rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.DEV_GUILD_ID!)) as {id: string, name: string, type: number, guild_id: string}[]

			// thisConsole.logDefault('Dev Environment:', DevEnvironment);
		}

		this.Initialize(client)

		if (GeneralData.development) {
			this.runTests(client)
		}
	},

	async Initialize(client: Client) {
		client.guilds.cache.forEach(async guild => {
			//* Any database initialization here
		})
	},

	async runTests(client: Client) {
		const guild: Guild = client.guilds.cache.get(process.env.DEV_GUILD_ID!)!
		const channel: TextChannel = await DevEnvironment.client?.channels.fetch(DevEnvironment.channelId) as TextChannel
	}
}

type InteractionOptionEntry = {name: string, value: any}
type FakeInteractionInput = {
	subCommand?: string,
	options: InteractionOptionEntry[]
}

class FakeInteractionOptions {
	constructor(
		public _hoistedOptions: InteractionOptionEntry[] = [],
		public subCommand?: string,
		public group?: string
	) {}

	public get(option: string) {
		return this._hoistedOptions.find(o => o.name === option)
	}
	public getString(option: string) { return this.get(option)?.value }
	public getRole(option: string) { return this.get(option)?.value }
	//TODO add typed getters like getString or getRole...

	public getSubcommand(required: boolean) { return this.subCommand }
	public getSubcommandGroup(required: boolean) { return this.group }

	public get _subcommand() { return this.subCommand }

	public get data() { //TODO include groups
		if (!this.subCommand) { return this._hoistedOptions }
		else {
			return [{
				name:    this.subCommand,
				options: this._hoistedOptions,
				type:    1
			}]
		}
	}
}

class FakeInteraction {
	public client: Client<boolean> = DevEnvironment.client!
	public guild: Guild = DevEnvironment.guild!
	public type: InteractionType = InteractionType.ApplicationCommand
	public componentType: ComponentType = 1

	public user: {[key: string]: any}
	public channel: TextChannel

	public options: FakeInteractionOptions

	constructor(
		public commandName: string,
		options?: FakeInteractionInput
	) {
		this.user = {
			id:       process.env.DEV_TEST_USER_ID!,
			username: 'TEST_USER',
			_equals:  (user) => {return true},
		}
		this.channel = DevEnvironment.channel!

		this.options = new FakeInteractionOptions(options?.options, options?.subCommand)
	}

	public get channelId() { return this.channel.id }
	public get guildId() { return this.guild.id };

	private message: Message | null = null

	public isChatInputCommand() {return true}
	public isRepliable() {return true}
	public inGuild() { return true }

	public fetchReply(): Promise<Message<boolean>> {
		if (!this.message) {
			EmitError(new Error('Unable to fetch reply of interaction'))
		}

		return new Promise((resolve) => {resolve(this.message!)})
	}

	public async reply(replyContent: string | {content: string, ephemeral: boolean, embeds: EmbedBuilder[], components: any[]}): Promise<Message|boolean> {
		const channel = this.guild.channels.cache.get(this.channel.id)
		if (!channel || !(channel instanceof TextChannel)) return false

		this.message = await channel.send(replyContent)
		return this.message
	}


	public execute() {
		this.client.emit('interactionCreate', this as unknown as Interaction)
	}
}