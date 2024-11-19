import mongoose from "mongoose";
import { cons, errorConsole } from "../..";
import generalData from '../index';
import { EmitError } from "../../events";

//? something like: mongodb+srv://<username>:<password>@<hostname>/<dbname>
const dbURITemplate: string = process.env.DATABASE_URI_TEMPLATE!

const mongoUser = encodeURIComponent(process.env.DATABASE_USERNAME!);
const mongoPass = encodeURIComponent(process.env.DATABASE_PASSWORD!);
const mongoHost = encodeURIComponent(process.env.DATABASE_HOSTNAME!);

const dbURI =  generalData.production ? 
	dbURITemplate
		.replace('<username>', mongoUser)
		.replace('<password>', mongoPass)
		.replace('<hostname>', mongoHost)
		.replace('<dbname>', process.env.PROJECT_NAME!) :
	(process.env.DATABASE_URI_LOCAL as string).replace('<dbname>', process.env.PROJECT_NAME!)
;

export class Database {
	public connection: mongoose.Connection|null
    constructor() {
        this.connection = null;
    }

    connect() {
        cons.log('Connecting to [style=bold][fg=blue]Database[/>]...')

		mongoose.connect(dbURI).then(() => {
			cons.log('[style=bold][fg=green]Connected[/>] to the [style=bold][fg=blue]Database[/>]!');
			this.connection == mongoose.connection;
		}).catch(error => {
			cons.log('[style=bold][fg=cyan]Database[/>] connection ERROR:\n');
			EmitError(error);
		});
	}
}