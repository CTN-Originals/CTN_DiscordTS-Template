import { ConsoleInstance } from 'better-console-utilities';

import { CommandInteraction } from 'discord.js';
import { EventEmitter } from 'events';
import errorEvent from '../events/error';
import { ErrorObject } from '../handlers/errorHandler';

export const eventConsole = new ConsoleInstance();
export const customEvents = new EventEmitter();


export async function EmitError(error: Error, ...args: (CommandInteraction | undefined)[]): Promise<ErrorObject> {
	return errorEvent.execute(error, ...args) as Promise<ErrorObject>;
}