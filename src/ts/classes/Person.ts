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
	 * The time step person was infected
	 */
	private _stepInfected: number = 0

	/**
	 * Time person uses to recover (days)
	 */
	private readonly _recoveryTime: number = 10

	/**
	 * How many have this person ifected
	 */
	private _peopleInfected: number = 0

	/**
	 * How many steps this person has been infected
	 */
	private _stepsInfected = 0

	/**
	 * Average infections for this person based on days infected
	 */
	private _avgInfections = 0

	/**
	 * the current time step for the person
	 */
	private _currentTimeStep = 0

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
	public infect(force: boolean): boolean {
		if (Math.random() < 0.5 && !force) return false
		this._stepInfected = this._currentTimeStep
		this._state = Compartment.INFECTED
		return true
	}

	public act() {
		if (this.state == Compartment.INFECTED) {
			this.tryInfectSurounings()
			if (this._currentTimeStep - this._stepInfected == this._recoveryTime) {
				if (Math.random() * 100 <= this._chanceOfDeath) {
					this.state = Compartment.DEAD
				} else {
					this.state = Compartment.RECOVERED
				}
			} else {
				this._stepsInfected++
				this._avgInfections =
					this._peopleInfected / this._stepsInfected + 1 / this._recoveryTime
			}
		}

		if (this._state == Compartment.DEAD || this._inQuarantine) return

		// Move entity to new position of there are any free positions around
		this.setNewPosition(
			this.grid.getRandomFreeLocationFromPoint(this.position, 1)
		)
	}

	public addTimeStep() {
		this._currentTimeStep++
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
					if (this.isInQuarantine && person.isInQuarantine) return

					if (person.infect(false)) {
					this._peopleInfected++
					}
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
