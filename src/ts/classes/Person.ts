import { Point } from './Point'
import { Grid } from './Grid'
import { GridLocation } from './GridLocation'

/**
 * Represents a person in the simulation.
 * A person can be in different states(Compartments), and is able to move
 * around the grid if the person is not in quarantine or dead.
 */
export class Person extends GridLocation {
	/**
	 * The state the person is in
	 */
	private _state: Compartment = Compartment.SUSCEPTIBLE

	/**
	 * Time stamp when person was infected
	 */
	private _infectionTime: number = 0

	/**
	 * Time person uses to recover (milliseconds)
	 */
	private readonly _recoveryTime: number = 7000

	/**
	 * How many have this person ifected
	 */
	private _peopleInfected: number = 0

	/**
	 * Is the person in quarantine?
	 */
	private _inQuarantine = false

	constructor(grid: Grid, position: Point) {
		super(grid, position)
	}

	public get state(): Compartment {
		return this._state
	}

	public set state(v: Compartment) {
		this._state = v
	}

	public get isInQuarantine(): boolean {
		return this._inQuarantine
	}

	public set isInQuarantine(quarantine: boolean) {
		this._inQuarantine = quarantine
	}

	/**
	 * Infects the person, and set a time stamp for when the person was infected
	 */
	public infect() {
		this._infectionTime = Date.now()
		this._state = Compartment.INFECTED
	}

	public act() {
		// Quarantined, and dead peaple cant act.
		if (this._state == Compartment.DEAD || this._inQuarantine) return

		if (this.state == Compartment.INFECTED) {
			this.tryInfectSurounings()
			if (this._infectionTime + this._recoveryTime < Date.now()) {
				this.state = Compartment.RECOVERED
			}
		}

		// Move entity to new position of there are any free positions around
		this.setNewPosition(
			this.grid.getRandomFreeLocationFromPoint(this.position, 1)
		)
	}

	/**
	 * Checks adjencent locations around the person, and if there are any persons
	 * adjevent to this person, try to infect them
	 */
	private tryInfectSurounings() {
		let adjecentLocations = this.grid.getAdjacentLocationsFromPoint(
			this.position,
			1
		)
		adjecentLocations.forEach((location) => {
			const person = this.grid.getObjectAtLocation(location)
			if (person instanceof Person) {
				if (person.state == Compartment.SUSCEPTIBLE) {
					person.infect()
					this._peopleInfected++
				}
			}
		})
	}
}

/**
 * States of the "people" in the SIR model.
 * Dead/Recovered are essentialy the same, but is divided for simulation purposes
 */
export enum Compartment {
	SUSCEPTIBLE,
	INFECTED,
	RECOVERED,
	DEAD,
}
