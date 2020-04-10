import { Point } from './Point'
import { Grid } from './Grid'

/**
 * Represents a location on the grid.
 *
 */
export class GridLocation {
	/**
	 * Position of the location
	 */
	private _position: Point

	/**
	 * Holds the grid where all locations are stored.
	 */
	private _grid: Grid

	constructor(grid: Grid, position: Point) {
		this._grid = grid
		this._position = position
	}

	public get position(): Point {
		return this._position
	}

	protected get grid(): Grid {
		return this._grid
	}

	/**
	 * Sets the new position for the GridLocation
	 * and clears its old position
	 * @param position new position
	 */
	public setNewPosition(position: Point) {
		this._grid.freeLocation(this._position)
		this._position = position
		this._grid.addToLocation(this, position)
	}
}
