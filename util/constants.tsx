// CONSTANTS
export const bailerSizeConstants = {
	1.375: 0.064,
	1.625: 0.092,
	1.75: 0.106,
	2: 0.125,
	2.125: 0.163,
	2.5: 0.218,
	2.625: 0.242,
	3: 0.308,
	3.5: 0.43,
	4: 0.573,
	5: 0.924,
};

export const bailerSizes = [
	1.375, 1.625, 1.75, 2, 2.125, 2.5, 2.625, 3, 3.5, 4, 5,
];

export const bailerLengths = [10, 15, 20, 25, 30, 35, 40];

export const productTypes = [
	'G1-G3',
	'Gray Lid',
	'Green Lid',
	'Red Lid',
	'Black Lid',
];

export const shearBondStrengths = {
	g1: [170, 270, 170, 320, 380, 420, 280, 280, 200, -1, -1, -1, -1],
	gray: [90, 220, 150, 200, 220, 230, 350, 400, 330, -1, -1, -1, -1],
	green: [80, 200, 130, 150, 175, 200, 320, 350, 300, -1, -1, -1, -1],
	red: [-1, -1, -1, -1, -1, -1, -1, 400, 330, 330, 330, 330, 330],
	black: [30, 100, 70, 400, 320, 350, 420, 180, -1, -1, -1, -1, -1],
};

export const temperatureRanges = [
	'70-99',
	'100-174',
	'175-200',
	'201-225',
	'226-250',
	'251-275',
	'276-300',
	'301-325',
	'326-350',
	'351-375',
	'376-400',
	'401-425',
	'426-450',
];