/**
 * Returns a random numer between min and max inclusinve.
 *
 * https://stackoverflow.com/a/7228322/4205975
 * @param min minimum to get
 * @param max maximum to get
 */
function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export { randomIntFromInterval }
