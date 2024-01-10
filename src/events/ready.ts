import { Client, Events } from 'discord.js';

import { ConsoleInstance } from 'better-console-utilities';

// import ErrorHandler from '../handlers/errorHandler';

const thisCons = new ConsoleInstance();

export default {
	name: Events.ClientReady,
	once: true,

	async execute(client: Client) {
		thisCons.log(`Logged in as ${client.user?.tag}!`);
		// thisCons.logDefault(client);
		client.emit(Events.Error, new Error("I'm an error"));
	},
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