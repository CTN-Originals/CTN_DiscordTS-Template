import { Client, WebhookClient } from "discord.js";
import { logWebhook, cons } from "..";
import generalData from "../data/generalData";
import { ConsoleInstance } from "better-console-utilities";

const thisCons = new ConsoleInstance();

export class ErrorObject {
	public error: Error;
	public errorType: string;
	public errorMessage: string;
	public errorStack: string;
	public formattedError: string;

	constructor(error: Error) {
		this.error = error;
		this.errorType = this.error.name ?? 'Error';
		this.errorMessage = this.error.message;
		this.errorStack = this.error.stack ?? '';
		this.formattedError = this.formatError();
	}

	formatError(): string {
		let formattedError = [
			`Error: ${this.errorType}`,
			`Message: ${this.errorMessage}`,
			`Stack:\n${this.formatStack()}`
		].join('\n');

		return formattedError;
	}

	formatStack(): string {
		let formattedStack = '';

		const stackArray = this.errorStack.split('\n');
		stackArray.shift();
		stackArray.forEach(stackLine => {
			formattedStack += `${stackLine}\n`;
		});

		return formattedStack;
	}
}

