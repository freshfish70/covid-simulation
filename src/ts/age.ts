/**
 * Mortality by age in percent.
 * Stats from: https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/
 * ages from base to X9> 0-9 , 10-19 etc..
 */
const mortalityByAge = [
	{ age: 80, mortality: 0.148 },
	{ age: 70, mortality: 0.08 },
	{ age: 60, mortality: 0.036 },
	{ age: 50, mortality: 0.013 },
	{ age: 40, mortality: 0.004 },
	{ age: 30, mortality: 0.002 },
	{ age: 20, mortality: 0.002 },
	{ age: 10, mortality: 0.002 },
	{ age: 0, mortality: 0 },
]

/**
 * Chosen as a -+ avarage of the above values
 */
const flatMortality = 0.03

/**
 * Chance of selecting ages in ranges
 */
const ageChances = [
	{
		maxAge: 90,
		minAge: 80,
		chance: 0.08,
	},
	{
		maxAge: 79,
		minAge: 60,
		chance: 0.2,
	},
	{
		maxAge: 59,
		minAge: 40,
		chance: 0.25,
	},
	{
		maxAge: 39,
		minAge: 20,
		chance: 0.3,
	},
	{
		maxAge: 19,
		minAge: 0,
		chance: 0.17,
	},
]

/**
 * Selects the mortality for the provided age. If the age is not found
 * returns flat mortality (0.03)
 * @param age age to get mortality of
 */
function getMortalityByAge(age: number) {
	for (let index = 0; index < mortalityByAge.length; index++) {
		if (age >= mortalityByAge[index].age) {
			return mortalityByAge[index].mortality
		}
	}
	return flatMortality
}

let total = 0

/**
 * Returns a random age by a weighted table
 */
function selectRandomAge() {
	if (total == 0) {
		for (let index = 0; index < ageChances.length; index++) {
			total += ageChances[index].chance
		}
	}

	let random = Math.random() * total
	for (let index = 0; index < ageChances.length; index++) {
		var p = ageChances[index]
		if (random < p.chance) {
			return p
		}
		random -= p.chance
	}
}

export {
	mortalityByAge,
	flatMortality,
	ageChances,
	getMortalityByAge,
	selectRandomAge,
}
