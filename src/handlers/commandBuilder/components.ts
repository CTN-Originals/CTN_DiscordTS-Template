import { APIMessageComponentEmoji, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder, ComponentType, MentionableSelectMenuBuilder, RoleSelectMenuBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder } from "discord.js";
import { CommandObjectInput } from ".";

export type RequiredBaseFields = 'type' | 'customId';
export type OptionalBaseFields = 'disabled';

export type ComponentObjectInput<
    T extends BaseComponentObject,
    Optional extends keyof T = never,
    Required extends keyof T = never
> = RequiredFields<
    Partial<Pick<T, Optional | OptionalBaseFields>> & Pick<T, RequiredBaseFields | Required>,
    RequiredBaseFields | Required
>;

export type AnyComponentBuilder = 
ButtonBuilder |
StringSelectMenuBuilder |
UserSelectMenuBuilder |
RoleSelectMenuBuilder |
MentionableSelectMenuBuilder |
ChannelSelectMenuBuilder;

export type AnySelectMenyComponentBuilder = Exclude<AnyComponentBuilder, ButtonBuilder>;

type IBaseComponentObject = ComponentObjectInput<BaseComponentObject>
export class BaseComponentObject {
	public type!: ComponentType;
	public customId!: string;
	public disabled: boolean = false;

	constructor(input: IBaseComponentObject) {
		this.type = input.type;
		this.customId = input.customId;

		if (input.disabled !== undefined) { this.disabled = input.disabled; }
	}

	protected assignFields(input: ComponentObjectInput<BaseComponentObject, any>) {
		for (const field in input) {
			this[field] = input[field];
		}
	}

	protected buildBase<T extends AnyComponentBuilder>(builder: T): T {
		const component = builder.setCustomId(this.customId) as T;

		if (this.disabled) { component.setDisabled(this.disabled); }

		return component;
	}
}

type IBaseSelectComponentObject = ComponentObjectInput<BaseSelectComponentObject, 'minValues' | 'maxValues'>
export class BaseSelectComponentObject extends BaseComponentObject {
	public minValues: number = 1;
	public maxValues: number = 1;

	constructor(input: IBaseSelectComponentObject) {
		super(input);
		this.assignFields(input);
	}

	protected buildSelectMenuBase<T extends AnySelectMenyComponentBuilder>(builder: T): T {
		const component = this.buildBase(builder) as T;

		if (this.minValues) { component.setMinValues(this.minValues); }
		if (this.maxValues) { component.setMaxValues(this.maxValues); }

		return component;
	}
}

export type IButtonComponentObject = ComponentObjectInput<ButtonComponentObject, 'label' | 'style' | 'emoji' | 'type'>;
export class ButtonComponentObject extends BaseComponentObject {
	public label?: string
	public style: ButtonStyle = ButtonStyle.Primary;
	public emoji?: APIMessageComponentEmoji;

	public get build() {
		const component = this.buildBase(new ButtonBuilder());
		return component;
	}
}

export class StringSelectComponentObject extends BaseSelectComponentObject {
	public get build() {
		const component = this.buildSelectMenuBase(new StringSelectMenuBuilder());
		return component;
	}
}
export class UserSelectComponentObject extends BaseSelectComponentObject {
	public get build() {
		const component = this.buildSelectMenuBase(new UserSelectMenuBuilder());
		return component;
	}
}
export class RoleSelectComponentObject extends BaseSelectComponentObject {
	public get build() {
		const component = this.buildSelectMenuBase(new RoleSelectMenuBuilder());
		return component;
	}
}
export class MentionableSelectComponentObject extends BaseSelectComponentObject {
	public get build() {
		const component = this.buildSelectMenuBase(new MentionableSelectMenuBuilder());
		return component;
	}
}
export class ChannelSelectComponentObject extends BaseSelectComponentObject {
	public get build() {
		const component = this.buildSelectMenuBase(new ChannelSelectMenuBuilder());
		return component;
	}
}