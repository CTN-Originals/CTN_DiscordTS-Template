import { Client, Events } from 'discord.js';

import { eventConsole } from '.';
import { client, errorConsole } from '..';
import { ErrorObject } from '../handlers/errorHandler';


export default {
	name: Events.Error,
	once: false,

	async execute(error: Error): Promise<ErrorObject> {
		// eventConsole.log('Error event triggered');

		const errorObject = new ErrorObject(error);

		errorConsole.log(errorObject.formattedError);

		return errorObject;
	},
};