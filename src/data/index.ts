import { Color } from "better-console-utilities";
import { BaseChannel, Client, Collection, Guild, GuildMember, User } from "discord.js"


export class DevEnvironment {
	public static readonly clientId: string = process.env.DEV_CLIENT_ID!;
	public static readonly guildId: string = process.env.DEV_GUILD_ID!;
	public static readonly channelId: string = process.env.DEV_TEST_CHANNEL_ID!;
	public static readonly userId: string = process.env.DEV_TEST_USER_ID!;

	public static client = undefined as Client|undefined;
	public static guild = undefined as Guild|undefined;
	public static user = undefined as User|undefined;
	public static member = undefined as GuildMember|undefined;
	public static channel = undefined as BaseChannel|undefined;

	public static memberList = new Collection() as Collection<string, GuildMember>;
	public static restCommands = undefined as {id: string, name: string, type: number, guild_id: string}[]|undefined;

	//TODO Make an initialize function and set all fields here instead of in ready.ts
}

export class GeneralData {
	public static readonly production: boolean = (process.env.PRODUCTION == 'true');
	public static readonly development: boolean = (process.env.DEVELOPMENT == 'true');

	public static readonly appName: string = process.env.APP_NAME!;
	public static readonly supportServerInvite: string = process.env.SUPPORT_SERVER_INVITE!;
	
	public static readonly logging = {
		streamSafe: false, //? If true, the custom console will filter out any dangerouse info
		interaction: {
			enabled: true,
			verbose: true,
		}
	}
}

export class ColorTheme {
	public static readonly brand = {
		primary: new Color('#3fb7e9'),
		secondary: new Color('#2a55e2'),
		accent: new Color('#92d5e8'),
		background: new Color('#090909')
	}

	public static readonly embeds = {
		info: new Color('#0077ff'),
		reply: new Color('#00ff73'),
		notice: new Color('#ffbb00'),
		error: new Color('#ff4800'),
	}

	public static readonly colors = {
		blue: 	new Color('#0080ff'),
		green: 	new Color('#00cc00'),
		cyan: 	new Color('#00ffff'),
		yellow: new Color('#dfbc22'),
		orange: new Color('#dd8000'),
		purple: new Color('#ad1b70'),
		grey: 	new Color('#aaaaaa'),
	}
}
