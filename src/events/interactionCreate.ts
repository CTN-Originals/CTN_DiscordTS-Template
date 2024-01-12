import { 
	BaseInteraction,
	CommandInteraction,
	Client,
	InteractionType,
	ComponentType,
	Events,
	TextChannel,
} from 'discord.js';

import { ConsoleInstance } from 'better-console-utilities';

import { EmitError, eventConsole } from '.';
import { errorConsole } from '..';
import { IInteractionTypeData, getInteractionType } from '../utils/interactionUtils';
import generalData from '../data/generalData';
import { ErrorObject } from '../handlers/errorHandler';

const thisConsole = new ConsoleInstance();

export default {
	name: Events.InteractionCreate,
	once: false,

    /** @param {CommandInteraction} interaction The command interaction */
	async execute(interaction: BaseInteraction) {
		const interactionType = getInteractionType(interaction);
		
		if (!interactionType.commandKey || interactionType.type == InteractionType.Ping) {
			thisConsole.log(`No Command Key || PING Interaction Received`);
			thisConsole.logDefault(interaction);
			return;
		}
		await this.executeInteraction(interaction, interactionType.commandKey);
	},

	async executeInteraction(interaction: BaseInteraction, nameKey: string) {
		let response: any = null;
		try { 
			const command = interaction.client.commands.get(interaction[nameKey]);
			response = await command.execute(interaction);
		} catch (err) {
			const errorObject: ErrorObject = await EmitError(err as Error, interaction); //?? does "as Error" fuck this? ever??

			let content = `There was an error while executing this interaction`
			if (generalData.development) {
				content += '\n```ts\n' + errorObject.formatError(true, true) + '\n```';
			}

			const replyContent = {
				content: content,
				ephemeral: true,
			};
			
			if (interaction.isRepliable()) {
				if (!interaction.replied) { //?? does this need "&& !interaction.deferred"?
					await interaction.reply(replyContent).catch(EmitError);
				}
				else await interaction.followUp(replyContent).catch(EmitError);
			}

			response = err;
		}

		this.outputLog(interaction, response);
	},

	outputLog(interaction, response = null) {
		if (generalData.logging.interaction.enabled) {
			console.log(interaction);
			const interactionType: IInteractionTypeData = getInteractionType(interaction)
			const commandName = (interactionType.commandKey) ? interaction[interactionType.commandKey] : 'undefined'

			var logMessage = [
				`\n[fg=cyan]${interaction.user.username}[/>] ([fg=aaaaaa]${interaction.user.id}[/>])`,
				`in [fg=black bg=white]#${interaction.channel.name}[/>]`,
				`\n[fg=0080ff]${interactionType.display}[/>]: [fg=888888]/[/>][fg=00cc00]${commandName}[/>]`,
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