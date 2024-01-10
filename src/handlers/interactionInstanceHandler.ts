import { CommandInteraction, StringSelectMenuInteraction, ButtonInteraction } from "discord.js";

import { ConsoleInstance } from "better-console-utilities";

import generalData from "../data/generalData";

const thisCons = new ConsoleInstance();

class InteractionInstanceList {
	public commandName: string;
	public interactionInstances: { [name: string]: InteractionInstance };
	public timeoutTime: number;

	constructor(commandName: string) {
		this.commandName = commandName;
		this.interactionInstances = {};
		this.timeoutTime = 1000 * 60 * 5; // 5 minutes
	}

	createInstance(interaction: CommandInteraction | StringSelectMenuInteraction | ButtonInteraction): InteractionInstance {
		this.interactionInstances[interaction.user.id] = new InteractionInstance(interaction);
		this.interactionInstances[interaction.user.id].timeout = setTimeout(() => { this.deleteInstance(interaction); }, this.timeoutTime);
		return this.interactionInstances[interaction.user.id];
	}

	getInstance(interaction: CommandInteraction | StringSelectMenuInteraction | ButtonInteraction, createIfNull = true): InteractionInstance {
		const inst = this.interactionInstances[interaction.user.id];
		if (!inst && createIfNull) {
			const inst = this.createInstance(interaction);
			inst.timeout = setTimeout(() => { this.deleteInstance(interaction); }, this.timeoutTime);
			return inst;
		} else {
			clearTimeout(inst.timeout!)
			inst.timeout = setTimeout(() => { this.deleteInstance(interaction); }, this.timeoutTime);

			if (interaction instanceof CommandInteraction) inst.interactions.command = interaction;
			else if (interaction instanceof StringSelectMenuInteraction) inst.interactions.select = interaction;
			else if (interaction instanceof ButtonInteraction) inst.interactions.button = interaction;
		}

		return inst;
	}

	deleteInstance(interaction: CommandInteraction | StringSelectMenuInteraction | ButtonInteraction): void {
		if (!this.interactionInstances[interaction.user.id]) return;
		if (generalData.logging.interaction.verbose) {
			thisCons.log(`[fg=red]Deleting[/>] ([fg=cyan]${this.commandName}[/>]) [fg=red]instance[/>]: [fg=green]${interaction.user.id}`, { autoColorize: false });
		}

		clearTimeout(this.interactionInstances[interaction.user.id].timeout ?? undefined);
		delete this.interactionInstances[interaction.user.id];
	}
}

class InteractionInstance {
	public interactions: {
		command: CommandInteraction | null;
		select: StringSelectMenuInteraction | null;
		button: ButtonInteraction | null;
	};
	public reply: {
		content: string;
		embeds: any[];
		components: any[];
		ephemeral: boolean;
	};
	public values: {
		select: string[];
	};
	public timeout: NodeJS.Timeout | null;

	constructor(interaction: CommandInteraction | StringSelectMenuInteraction | ButtonInteraction) {
		this.interactions = {
			command: (interaction instanceof CommandInteraction) ? interaction : null,
			select: (interaction instanceof StringSelectMenuInteraction) ? interaction : null,
			button: (interaction instanceof ButtonInteraction) ? interaction : null,
		};

		this.reply = {
			content: 'No content',
			embeds: [],
			components: [],
			ephemeral: true,
		};
		this.values = {
			select: [],
		};
		this.timeout = null;
	}
}

export {
	InteractionInstanceList,
	InteractionInstance,
};
