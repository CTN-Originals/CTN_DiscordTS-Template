import 'dotenv/config';
import { APIUser, Client, CommandInteraction, EmbedBuilder, Events, Guild, Message, TextChannel, User } from 'discord.js';

import { ConsoleInstance } from 'better-console-utilities';
import { testEmbed, validateEmbed } from '../utils/embedUtils';
import { cons, testWebhook } from '..';
import { ISimBaseInteraction, SimBaseInteraction, init as simInit } from '../handlers/interactionSimulator';
import { customEvents } from '.';

// import ErrorHandler from '../handlers/errorHandler';

const thisCons = new ConsoleInstance();

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client, ...args: any[]) {
		thisCons.log(`Logged in as ${client.user?.tag}!\n`);
		thisCons.logDefault(client);

		
		const t0 = performance.now();
		const devGuildMembers = await client.guilds.cache.get(process.env.DEV_GUILD_ID!)?.members.fetch();
		const t1 = performance.now();
		thisCons.log(`Fetched ${devGuildMembers?.size} guild members in ${t1 - t0}ms`);

		// await new Promise(resolve => setTimeout(resolve, 1000));
		this.runTests(client);
	},

	async runTests(client: Client) {
		const guild: Guild|undefined = client.guilds.cache.get(process.env.DEV_GUILD_ID!);
		
		/* //? A test for token filtering
		const testObj = {id: '123', token: 'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z', 
			client: {
				application: {
					id: '123',
					name: 'Test',
					description: 'Test',
					age: 48,
					bot: true,
					token: 'a1b2c3d4e5f6g7h8i9j10k11l12m13n14o15p16q17r18s19t20u21v22w23x24y25z',
					rec: {},
				}
			}
		};
		testObj.client.application.rec = testObj.client.application;
		cons.logDefault(testObj);
		*/

		await simInit().then(() => {
			const simInteraction = new SimBaseInteraction();
			// cons.logDefault(simInteraction);
			console.log(simInteraction);
			console.log(simInteraction.member!['_roles']);
		});

		/* //? This is using a fake interaction object to test slash
			? This is using a fake interaction object to test commands
			const fakeInteraction: any = {
				client: client,
				guild: guild as Guild,
				commandName: 'ping',
				type: 2,
				componentType: 1,
				guildId: guild?.id,
				channelId: process.env.DEV_TEST_CHANNEL_ID,
				user: {
					id: process.env.DEV_TEST_USER_ID,
					username: 'keybotkiller',
					_equals: (user) => {return true},
				},
				channel: {
					id: process.env.DEV_TEST_CHANNEL_ID,
					name: 'bot-testing',
				} as Partial<TextChannel>,
				options: {
					data: {}
				},
				isRepliable: () => {return true},
				reply: async (replyContent: string | {content: string, ephemeral: boolean, embeds: EmbedBuilder[], components: any[]}): Promise<Message|boolean> => {
					const channel = guild?.channels.cache.get(fakeInteraction.channel.id);
					if (!channel || !(channel instanceof TextChannel)) return false;
					return channel.send(replyContent);
				},
			}
			? This is testing the error handler
			client.emit(Events.InteractionCreate, fakeInteraction);
		*/

		/* //? This is using a fake message object to test the embed validator
		const validatedTestEmbed = validateEmbed(testEmbed);
		console.log(validatedTestEmbed);
		testWebhook.send({
			embeds: [validatedTestEmbed]
		});
		 */
	}
};


/* //? string builder to filter out a 72 char discord token and replace it
import (
    "fmt"
    "strings"
)

func main() {
    myString := "Hahaha world [code here] Yes"
    n := len(myString)
    last := 0
    var sb strings.Builder
    for i := 0; i <= n; i++ {
        if i >= n || myString[i] == ' ' {
            if i-last == 72 {
                sb.WriteString(strings.Repeat("*", i-last))
            } else {
                sb.WriteString(myString[last:i])
            }
            sb.WriteRune(' ')
            last = i + 1
        }
    }

    fmt.Println(sb.String())
}
*/
