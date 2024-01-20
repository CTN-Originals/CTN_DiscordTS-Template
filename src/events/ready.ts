import 'dotenv/config';
import { APIUser, Client, CommandInteraction, EmbedBuilder, Events, Guild, Message, TextChannel, User } from 'discord.js';

import { ConsoleInstance } from 'better-console-utilities';
import { testEmbed, validateEmbed } from '../utils/embedUtils';
import { testWebhook } from '..';

// import ErrorHandler from '../handlers/errorHandler';

const thisCons = new ConsoleInstance();

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client) {
		thisCons.log(`Logged in as ${client.user?.tag}!\n`);
		thisCons.logDefault(client);

		this.runTests(client);
	},

	async runTests(client: Client) {
		const guild = client.guilds.cache.get(process.env.DEV_GUILD_ID!);
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

		// client.emit(Events.InteractionCreate, fakeInteraction);

		// const validatedTestEmbed = validateEmbed(testEmbed);
		// console.log(validatedTestEmbed);
		// testWebhook.send({
		// 	embeds: [validatedTestEmbed]
		// });
	}
};

/* string builder to filter out a 72 char discord token and replace it
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

// _equals(user) {`\n    return (\n      user &&\n      this.id === user.id &&\n      this.username === user.username &&\n      this.discriminator === user.discriminator &&\n      this.globalName === user.global_name &&\n      this.avatar === user.avatar &&\n      this.flags?.bitfield === user.public_flags &&\n      ('banner' in user ? this.banner === user.banner : true) &&\n      ('accent_color' in user ? this.accentColor === user.accent_color : true)\n    );\n  `}
