import { ConsoleInstance } from "better-console-utilities";
import errorEvent from "../events/error";
import { ErrorObject } from "../handlers/errorHandler";

export const eventConsole = new ConsoleInstance();

export async function EmitError(error: Error): Promise<ErrorObject> {
	return errorEvent.execute(error) as Promise<ErrorObject>;
}