import type { Color } from 'better-console-utilities';
import { duration } from 'moment';

//? a class that can take a string like 23s 69m 2h and turn it into a time length of 23 seconds, 9 minutes and 3 hours.
export class PeriodOfTime {
	public time: number;
	
	private formatedInput: string;
	private readonly sortOrder: string[] = ['D', 'H', 'M', 'S'];

	constructor(public input: string) {
		this.formatedInput = input.trim().toUpperCase();
		const split = this.formatedInput.split(' ');

		//? take out any time entries that dont have a correct flag after it
		for (let i = 0; i < split.length; i++) {
			const flag = split[i][split[i].length - 1];
			if (!this.sortOrder.includes(flag)) {
				split.splice(i, 1);
			}
		}

		//? sort the order of the input so the "moment" function can understand it
		this.formatedInput = split.sort((a, b) =>
			this.sortOrder.indexOf(a[a.length - 1]) - this.sortOrder.indexOf(b[b.length - 1])
		).join('');

		//? make sure PT is included the right way, put the day time input between the P and T if present
		this.formatedInput = (this.formatedInput.includes('D')) ? 'P' + this.formatedInput.replace('D', 'DT') : 'PT' + this.formatedInput;

		//? get the time in miliseconds
		this.time = duration(this.formatedInput).asMilliseconds();
	}

	public toString(): string {
		return getTimeDisplay(this.time);
	}

	public get dateTime(): Date {
		return new Date(this.time);
	}
}

/**
 * Converts milliseconds into greater time units as possible
 * 
 * source: https://stackoverflow.com/a/68673714
 * @param {int} ms - Amount of time measured in milliseconds
 * @return {?Object} Reallocated time units. NULL on failure.
 */
export function timeUnits(ms: number): {
	days: number,
	hours: number,
	minutes: number,
	seconds: number,
	milliseconds: number
} {
	if ( !Number.isInteger(ms) ) { 
		return {
			days:         0,
			hours:        0,
			minutes:      0,
			seconds:      0,
			milliseconds: 0
		};
	}

	/**
	 * Takes as many whole units from the time pool (ms) as possible
	 * @param {int} msUnit - Size of a single unit in milliseconds
	 * @return {int} Number of units taken from the time pool
	 */
	const allocate = (msUnit: number): number => {
		const units = Math.trunc(ms / msUnit);
		ms -= units * msUnit;
		return units;
	};

	// Property order is important here.
	// These arguments are the respective units in ms.
	return {
		// weeks: allocate(604800000), // Uncomment for weeks
		days:         allocate(86400000),
		hours:        allocate(3600000),
		minutes:      allocate(60000),
		seconds:      allocate(1000),
		milliseconds: ms // remainder
	};
}

//? discords needs a specific timestamp for their timestamp embeds to work...
export function getTimestamp(date: Date|number): number {
	let rawTime = '0';

	if (typeof date == 'number') {
		rawTime = date.toString();
	} else {
		rawTime = date.getTime().toString();
	}

	const timeSplit = rawTime.split('');
	const time = timeSplit.splice(0, 10).join('');
	
	return parseFloat(time);
}

export function getTimeDisplay(time: number, colored: boolean = false): string {
	const units = timeUnits(time);
	const formatTime = (t: number): string | number => {return (t < 10) ? `0${t}` : t;};

	if (!colored) {
		return `${units.days}d ${formatTime(units.hours)}:${formatTime(units.minutes)}:${formatTime(units.seconds)}`;
	} else {
		return [
			'```ansi\n',
			`[0;33m${units.days}d[0m `,
			`[0;34m${formatTime(units.hours)}[0m:`,
			`[0;36m${formatTime(units.minutes)}[0m:`,
			`[0;32m${formatTime(units.seconds)}[0m`,
			'\n```'
		].join('');
	}
}

export function hexToBit(hex: string): number;
export function hexToBit(color: Color): number;
export function hexToBit(hex_color: string|Color): number {
	if (typeof hex_color == 'string') {
		return parseInt('0x' + hex_color.replace('#', ''));
	}
	else {
		return parseInt('0x' + hex_color.asHex.replace('#', ''));
	}
}

export function includesAny(target: string|string[], items: string[]): boolean {
	for (const item of items) {
		if (target.includes(item)) { return true; }
	}

	return false;
}
export function includesAll(target: string|string[], items: string[]): boolean {
	for (const item of items) {
		if (!target.includes(item)) { return false; }
	}

	return true;
}

export function getUniqueItems<T>(...arrays: T[][]): T[] {
	const itemCount: { [key: string]: number } = {};
	
	// Combine all arrays into one
	const allItems = arrays.reduce((acc, curr) => acc.concat(curr), []);
	
	// Count how many times each item appears
	for (const item of allItems) {
		const key = JSON.stringify(item);
		if (itemCount[key]) {
			itemCount[key]++;
		} else {
			itemCount[key] = 1;
		}
	}
	
	// Collect items that appear only once
	const uniqueItems: T[] = [];
	for (const key in itemCount) {
		if (itemCount[key] === 1) {
			uniqueItems.push(JSON.parse(key));
		}
	}
	
	return uniqueItems;
}

// Inline function to remove duplicate items from an array
export function removeDuplicates<T>(input: T[]): T[] {
	return input.filter((item, index, self) => self.indexOf(item) === index);
};

export function clamp(num: number, min?: number, max?: number): number {
	return Math.min(Math.max(num, (min ?? num)), (max ?? num));
};