import { Client, WebhookClient } from "discord.js";

import { Color, ConsoleInstance, Theme } from "better-console-utilities";

import { logWebhook, cons, errorConsole } from "..";
import generalData from "../data/generalData";

const thisCons = new ConsoleInstance();
const rootPath = process.cwd();
const defaultColor = errorConsole.theme.typeThemes.default ?? errorConsole.theme.default;

interface IErrorObjectOptions {
	replaceRootPath?: boolean;
}
export class ErrorObject {
	public error: Error;
	public options: Partial<IErrorObjectOptions>;
	public errorType: string;
	public errorMessage: string;
	public errorStack: string;
	public formattedError: string;

	constructor(error: Error, options?: Partial<IErrorObjectOptions>) {
		this.options = {
			replaceRootPath: options?.replaceRootPath ?? true,
		}

		this.error = error;
		this.errorType = this.error.name ?? 'Error';
		this.errorMessage = this.error.message;
		this.errorStack = this.error.stack ?? '';
		this.formattedError = this.formatError();
	}

	formatError(shortenPaths: boolean = false, raw: boolean = false): string {
		let formattedError = [
			`Error: ${this.errorType}`,
			`Message: ${this.errorMessage}`,
			`Stack:\n${this.formatStack(shortenPaths, raw)}`
		].join('\n');

		return formattedError;
	}

	formatStack(shortenPaths: boolean = false, raw: boolean = false, inlineSeperator: string = ' ', linePrefix: string = '    '): string {
		let formattedStack = '';
		
		if (this.options.replaceRootPath && rootPath) {
			this.errorStack = this.errorStack.replaceAll(rootPath + '\\', ``);
		}
		
		const stackArray = this.errorStack.split('\n');
		stackArray.shift();
		stackArray.forEach(stackLine => {
			//> split: at Object.execute <-> (src\events\ready.ts:14:29)
			const lineSplit = stackLine.split(' (');
			let call = lineSplit[0].replace('at ', '').trimStart();
			let path = lineSplit[1].replace(')', '');

			if (shortenPaths) { //? Shorten the path by cutting out the middle of the path and replacing it with '...'
				const pathSplit = path.split('\\');
				const pathLength = pathSplit.length;
				if (pathLength > 3) {
					path = `${pathSplit[0]}\\...\\${pathSplit[pathLength - 2]}\\${pathSplit[pathLength - 1]}`;
				}
			}

			if (!raw) {
				const callTheme = new Theme(defaultColor.foreground, defaultColor.background, []);
				const pathTheme = new Theme('#aaaaaa', null, []);
	
				if (path.startsWith('node:')) {
					callTheme.addStyle('dim');
					callTheme.removeStyle('bold');
					pathTheme.addStyle('dim');
				}
				else if (path.startsWith('src\\')) {
					callTheme.foreground = new Color('#00a85a');
				}
				else if (path.startsWith('node_modules\\')) {
					callTheme.foreground = new Color('#cdaa7d');
				}
				path = `${pathTheme.getThemedString(`${path}`)}`;
				call = `${callTheme.getThemedString(`${call}`)}`;
			}

			formattedStack += `${linePrefix}${call}${inlineSeperator}(${path})\n`;
		});
		
		return formattedStack;
	}
}