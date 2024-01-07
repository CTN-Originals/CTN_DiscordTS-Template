import { 
	CommandInteraction, 
	Client,
	InteractionType,
	ComponentType,
	Events,
} from 'discord.js';

// import { cons } from '..';
import generalData from '../data/generalData';
import { ConsoleInstance } from 'better-console-utilities';
import { eventConsole } from '.';
import { errorConsole } from '..';

const thisConsole = new ConsoleInstance();

export default {
	name: Events.InteractionCreate,
	once: false,

    /** @param {CommandInteraction} interaction The command interaction */
	async execute(interaction) {
		// if (!interaction.isChatInputCommand()) return;
        const client = interaction.client;

		if (interaction.isCommand() || interaction.isButton() || interaction.isStringSelectMenu()) {
			const nameKey = interaction.isCommand() ? 'commandName' : interaction.isButton() ? 'customId' : 'customId';
			if (client.commands.has(interaction[nameKey])) {
				await this.executeInteraction(interaction, client, nameKey);
			}
		}
	},

	/** 
	 * @param {CommandInteraction} interaction The command interaction
	 * @param {Client} client The client
	 * @param {string} nameKey The key to get the command name from the interaction
	*/
	async executeInteraction(interaction, client, nameKey) {
		const command = client.commands.get(interaction[nameKey]);
		let response: any = null;
		try { 
			response = await command.execute(interaction);
		} catch (err) {
			let content = `There was an error while executing this interaction :/` 
			if (generalData.development) {
				content += `\n\`\`\`js\n${err}\n\`\`\``;
			}

			errorConsole.log(err)
			await interaction.reply({
				ephemeral: true,
				content: `There was an error while executing this interaction :/`
			}).catch(errorConsole.log);
			response = err;
		}

		if (generalData.logging.interaction.enabled) {
			// console.log(interaction);
			const commandName = interaction.type == InteractionType.MessageComponent ? 
				interaction.customId : 
				interaction.commandName
			;
			let interactionType = '';
			switch(interaction.type) {
				case InteractionType.ApplicationCommand: { interactionType = 'Command'; } break;
				case InteractionType.ModalSubmit: { interactionType = 'Modal Submit'; } break;
				case InteractionType.MessageComponent: { 
					switch(interaction.componentType) {
						case ComponentType.ActionRow: { interactionType = 'ActionRow'; } break;
						case ComponentType.Button: { interactionType = 'Button'; } break;
						case ComponentType.StringSelect: { interactionType = 'Select(String)'; } break;
						case ComponentType.ChannelSelect: { interactionType = 'Select(Channel)'; } break;
						case ComponentType.MentionableSelect: { interactionType = 'Select(Mentionable)'; } break;
						case ComponentType.RoleSelect: { interactionType = 'Select(Role)'; } break;
						case ComponentType.TextInput: { interactionType = 'TextInput'; } break;
						case ComponentType.UserSelect: { interactionType = 'Select(User)'; } break;
						default: break;
					}
				} break;
				default: { interactionType = 'Unknown'; } break;
			}

			var logMessage = [
				`\n[fg=cyan]${interaction.user.username}[/>]([fg=cc00ff]${interaction.user.id}[/>])`,
				`in [fg=black bg=white]#${interaction.channel.name}[/>]`,
				`\n[fg=0080ff]${interactionType}[/>]: [fg=ffaa00]/[/>][fg=00cc00]${commandName}[/>]`,
			].join(' ');
			

			const options = interaction.options;
			if (options) {
				const input = interaction.options._hoistedOptions;
				const subcommand = options._subcommand ? ` [fg=blue st=bold,underscore]${options._subcommand}[/>]` : '';

				var commandOptions = '';
				for (let i = 0; i < input.length; i++) {
					const option = input[i];
					if (option.value != null) {
						commandOptions += `[fg=blue]${option.name}[/>]:[fg=cyan]${option.value}[/>] `
					}
				}
				logMessage += subcommand + '\n';
				logMessage = (commandOptions != '') ? logMessage + commandOptions + '\n' : logMessage;
			}

			if (response) {
				thisConsole.log(logMessage + `Response:`, response)
			}
			else {
				thisConsole.log(logMessage);
			}
		}
	}
};