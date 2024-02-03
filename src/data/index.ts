import { Guild } from "discord.js"


export const devEnvironment = {
	guild: undefined as Guild|undefined,
}

export default {
	development: true,
	
	logging: {
		interaction: {
			enabled: true,
			verbose: true,
		}
	}
}