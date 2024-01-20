import { BaseInteraction, Client, SnowflakeUtil } from "discord.js";
import { RawInteractionData } from "discord.js/typings/rawDataTypes";


export class SimBaseInteraction extends BaseInteraction {
	constructor(client: Client<true>, data?: Partial<RawInteractionData>) {
		const snowflake = SnowflakeUtil.generate()
		data = {
			application_id: data?.application_id ?? process.env.CLIENT_ID as string,
			type: data?.type ?? 2 as number,
			id: data?.id ?? snowflake.toString() as string,
			token: data?.token ?? process.env.TOKEN as string,
		} as RawInteractionData;

		super(client, data as RawInteractionData);
	}
}

const fakeClient: Client<true> = new Client({intents: ['Guilds']});

new SimBaseInteraction(fakeClient)