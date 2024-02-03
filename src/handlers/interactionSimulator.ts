import {
	APIChannel,
	APIGuildMember, APIInteractionGuildMember, APIModalSubmitInteraction,
	APIUser,
	BaseChannel, BaseGuild, BaseInteraction,
	Client, Guild,
	GuildBasedChannel, GuildChannel,
	GuildMember, GuildMemberFlags,
	GuildTextBasedChannel,
	Snowflake,
	SnowflakeUtil,
	User, UserFlagsBitField
} from "discord.js";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";
import { cons, client as defaultClient } from "..";
import { customEvents } from "../events";


const defaultClientId = process.env.DEV_CLIENT_ID as string;
const defaultGuildId = process.env.DEV_GUILD_ID as string;
const defaultChannelId = process.env.DEV_TEST_CHANNEL_ID as string;
const defaultUserId = process.env.DEV_TEST_USER_ID as string;

export interface ISimBaseInteraction {
	client: Client,
	user: User,
	guild?: BaseGuild|null,
	member?: GuildMember|APIInteractionGuildMember|null
	channel?: BaseChannel|null,
}

export interface ISimCommandInteraction extends ISimBaseInteraction { 
	commandName: string,
}
//TODO add all interaction interfaces

let defaultInteractionArgs: ISimBaseInteraction;
export async function init() {
	if (!defaultClient.isReady()) await new Promise(resolve => defaultClient.once('ready', () => resolve(true)));
	const defaultUser 		= defaultClient.users.cache.find(user => user.id === defaultUserId) as User
	const defaultGuild 		= defaultClient.guilds.cache.find(guild => guild.id === defaultGuildId) as Guild
	const defaultMember 	= defaultGuild.members.cache.find(member => member.id === defaultUserId) as GuildMember
	const defaultChannel 	= defaultClient.channels.cache.find(channel => channel.id === defaultChannelId) as BaseChannel

	defaultInteractionArgs = {
		client: defaultClient as Client,
		user: defaultUser as User,
		guild: defaultGuild as Guild,
		member: defaultMember as GuildMember|APIInteractionGuildMember,
		channel: defaultChannel as BaseChannel,
	} as ISimBaseInteraction;

	// console.log('defaultInteractionArgs');
	cons.logDefault('Simulator ready', defaultInteractionArgs);
}




export class SimBaseInteraction extends BaseInteraction {
	constructor(client: Client, user: User);
	constructor(args?: Partial<ISimBaseInteraction>);
	constructor(args?: Partial<ISimBaseInteraction>|Client, user?: User) {
		if (!args) args = defaultInteractionArgs as ISimBaseInteraction;
		else if (args instanceof Client) args = {client: args, user: user as User};
		else {
			for (const [key, value] of Object.entries(defaultInteractionArgs)) {
				if (typeof args[key as keyof ISimBaseInteraction] === undefined) {
					(args as any)[key] = value;
				}
			}
		}
		const client = args.client as Client<true>;

		const snowflake = SnowflakeUtil.generate()
		const data: RawInteractionData = {
			id: snowflake.toString() as RawInteractionData['id'],
			application_id: client.application?.id as RawInteractionData['application_id'],
			user: args.user as RawInteractionData['user'],
			type: 2 as RawInteractionData['type'],
			token: process.env.TOKEN as RawInteractionData['token'],
		} as RawInteractionData;

		if (args.guild) {
			data.guild_id = args.guild?.id;
			if (!args.member) args.member = defaultInteractionArgs.member as APIInteractionGuildMember;
			
			data.member = {
				user: args.user as APIGuildMember['user'],
				roles: args.member.roles as APIGuildMember['roles'],
				premium_since: null,
				permissions: '0',
				pending: args.member.pending,
				// nick: (args.member instanceof GuildMember) ? args.member.nickname : args.member.nick, //?? this is stupid... why is it either nickname or nick?
				mute: false,
				joined_at: new Date(SnowflakeUtil.timestampFrom(args.user?.id!)).toISOString() as APIGuildMember['joined_at'],
				is_pending: false,
				deaf: false,
				avatar: args.member.user.avatar as APIGuildMember['avatar'],
				flags: args.member.user.flags as UserFlagsBitField|GuildMemberFlags,
			} as APIInteractionGuildMember;

			if (!args.channel) {
				args.channel = defaultInteractionArgs.channel as BaseChannel;
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
}