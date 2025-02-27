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
	private readonly _recoveryTime: number = 14

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
	private _chanceOfDeath = 0

	/**
	 * The age of the person
	 */
	private _age = -1

	/**
	 * Hodlds a callback to a method that notifyies when the persin is recovered/dead (removed in SIR model)
	 */
	private _onRemovedCallback?: (person: Person) => void

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
		if (Math.random() < 0.9 && force == false) {
			return false
		}
		this._stepInfected = this._currentTimeStep
		this._state = Compartment.INFECTED
		return true
	}

	public act() {
		if (this.state == Compartment.INFECTED) {
			this.tryInfectSurounings()
			if (this._currentTimeStep - this._stepInfected == this._recoveryTime) {
				if (Math.random() <= this._chanceOfDeath) {
					this.state = Compartment.DEAD
					console.log(
						`DEAD - AGE: ${this._age} MORTALITY: ${this._chanceOfDeath}`
					)
				} else {
					this.state = Compartment.RECOVERED
				}

				if (this._onRemovedCallback) {
					this._onRemovedCallback(this)
				}
			} else {
				this._stepsInfected++
				this._avgInfections = this._peopleInfected / this._stepsInfected
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
	 * Registers a callback for when the person is considered Removed in SIR
	 * model terms (recoverd/dead)
	 *
	 * @param callback callback method
	 */
	public onRemovedCallback(callback: (person: Person) => void) {
		this._onRemovedCallback = callback
	}

	/**
	 * Enables or disables deaths
	 * @param allow true to allow deaths, false to disable
	 */
	public allowDeath(allow: boolean, mortality: number) {
		if (!allow) {
			this._chanceOfDeath = 0
		} else {
			this._chanceOfDeath = mortality
		}
	}

	/**
	 * Sets the age of the person in years
	 * @param age the age in years to set
	 */
	public setAge(age: number) {
		this._age = age
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
