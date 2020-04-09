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

	private _infectionTime: Number | undefined

	/**
	 * How many have this person ifected
	 */
	private _infected: Number = 0

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

	public infect() {
		this._infectionTime = Date.now()
		this._state = Compartment.INFECTED
	}

	public act() {
		// Quarantined, and dead peaple cant act.
		if (this._state == Compartment.DEAD || this._inQuarantine) return

		let p = this.grid.getRndAdjecentLocationFromPoint(this.position, 1)
		if (!p) return

		this.position.x = p.x
		this.position.y = p.y
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
