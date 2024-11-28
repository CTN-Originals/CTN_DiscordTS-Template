import { CommandObjectBase, CommandObjectInput } from "./base";
import { 
	AnySlashCommandOption,
	CommandObjectAttachmentOption,
	CommandObjectBooleanOption,
	CommandObjectChannelOption,
	CommandObjectIntegerOption,
	CommandObjectMentionableOption,
	CommandObjectNumberOption,
	CommandObjectRoleOption,
	CommandObjectStringOption,
	CommandObjectUserOption,
} from "./options";

export { 
	AnySlashCommandOption,
	CommandObjectBase,
	CommandObjectInput,
	CommandObjectAttachmentOption,
	CommandObjectBooleanOption,
	CommandObjectChannelOption,
	CommandObjectIntegerOption,
	CommandObjectMentionableOption,
	CommandObjectNumberOption,
	CommandObjectRoleOption,
	CommandObjectStringOption,
	CommandObjectUserOption,
}

export const nameAllowedCharacters = [
	'-', '_',
	"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
	'0','1','2','4','5','6','7','8','9'
];
