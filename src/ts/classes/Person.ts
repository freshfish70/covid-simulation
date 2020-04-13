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
	private _infectionTime: Date = new Date()

	/**
	 * Time person uses to recover (milliseconds)
	 */
	private readonly _recoveryTime: number = 10

	/**
	 * How many have this person ifected
	 */
	private _peopleInfected: number = 0

	private _daysInfected = 0

	private _avgInfections = 0

	/**
	 * Is the person in quarantine?
	 */
	private _inQuarantine = false

	/**
	 * The chance of dying when infected
	 */
	private _chanceOfDeath = 3.8

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

	public get peopleInfected(): number {
		return this._peopleInfected
	}

	public get avgInfections(): number {
		return this._avgInfections
	}

	/**
	 * Infects the person, and set a time stamp for when the person was infected
	 */
	public infect() {
		this._infectionTime = new Date()
		this._state = Compartment.INFECTED
	}

	public act() {
		// Quarantined, and dead peaple cant act.

		if (this.state == Compartment.INFECTED) {
			let currentDay =
				(new Date().getTime() - this._infectionTime.getTime()) / 1000

			this.tryInfectSurounings()
			if (currentDay > this._daysInfected) {
				this._daysInfected++
				this._avgInfections =
					this._peopleInfected / this._daysInfected + 1 / this._recoveryTime
				// console.log('Infextion day ' + this._daysInfected)
			}

			if (this._daysInfected == this._recoveryTime) {
				if (Math.random() * 100 <= this._chanceOfDeath) {
					this.state = Compartment.DEAD
				} else {
					this.state = Compartment.RECOVERED
				}
			}
		}
		if (this._state == Compartment.DEAD || this._inQuarantine) return

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
					this._peopleInfected++
					person.infect()
				}
			}
		})
	}

	/**
	 * Enables or disables deaths
	 * @param allow true to allow deaths, false to disable
	 */
	public allowDeath(allow: boolean) {
		if (!allow) {
			this._chanceOfDeath = 0
		}
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
