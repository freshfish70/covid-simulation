import { GridLocation } from './GridLocation'
import { Point } from './Point'

/**
 * A 2 dimensional grid.
 * The grid stores entities.
 */
export class Grid {
	private _sizeX: number = 1

	private _sizeY: number = 1

	public _grid: Array<Array<GridLocation | null>>

	constructor(sizeX: number, sizeY: number) {
		this._sizeX = sizeX
		this._sizeY = sizeY

		// Create the grid with null values
		// Tried using Array.fill, but the inner array was not a new array, but
		// reference of the last one, so all sub array were the same instace.
		this._grid = new Array(sizeX)
		for (let index = 0; index < this._grid.length; index++) {
			this._grid[index] = new Array(sizeY).fill(null)
		}
	}

	public get sizeX(): number {
		return this._sizeX
	}

	public get sizeY(): number {
		return this._sizeY
	}

	public get grid(): Array<Array<GridLocation | null>> {
		return this._grid
	}

	/**
	 * Sets the location to null
	 * @param location location to free up
	 */
	public freeLocation(location: Point) {
		this._grid[location.x][location.y] = null
	}

	/**
	 * Adds the grid location to the grid
	 * @param gridLocation grid location type to add
	 */
	public addToLocation(gridLocation: GridLocation, location: Point) {
		this._grid[location.x][location.y] = gridLocation
	}

	/**
	 * Returns the object at location
	 * @param location the location to get object at
	 */
	public getObjectAtLocation(location: Point): GridLocation | null {
		return this._grid[location.x][location.y]
	}

	public getAdjacentLocationsFromXY(x: number, y: number, size: number) {
		const selected: Array<Point> = new Array()
		for (let row = -size; row <= size; row++) {
			const currentRow = x + row
			if (currentRow >= 0 && currentRow < this.sizeX) {
				for (let column = -size; column <= size; column++) {
					const currentColumn = y + column
					if (
						currentColumn >= 0 &&
						currentColumn < this.sizeY &&
						(column != 0 || row != 0)
					) {
						selected.push(new Point(currentRow, currentColumn))
					}
				}
			}
		}
		this.shuffle(selected)
		return selected
	}

	/**
	 * Returns all adjec
	 * @param location the center point to search from
	 * @param size how large the "adjacent" search is
	 */
	public getAdjacentLocationsFromPoint(location: Point, size: number) {
		return this.getAdjacentLocationsFromXY(location.x, location.y, size)
	}

	/**
	 * Returns a random adjacent location from the provided X and Y coorinate.
	 * The location will allways be inside the grid, and can be null.
	 *
	 * @param x x position to get adjacent from
	 * @param y y position to get adjenct from
	 * @param size how large the "adjacent" search is
	 */
	public getRdAadjacentLocationFromXY(x: number, y: number, size: number) {
		return this.getAdjacentLocationsFromXY(x, y, size)[0]
	}

	/**
	 * Returns a random adjacent location from the provided point coorinate.
	 * The location will allways be inside the grid, and can be null.
	 *
	 * @param point center position to search from
	 * @param size how large the "adjacent" search is
	 */
	public getRdAadjacentLocationFromPoint(position: Point, size: number) {
		return this.getAdjacentLocationsFromXY(position.x, position.y, size)[0]
	}

	/**
	 * Returns a random free location around the provided point with a serch size
	 * of the provided size. If there are no free locations, returns current location
	 * @param position center position to search from
	 * @param size how large the "adjacent" search is
	 */
	public getRandomFreeLocationFromPoint(position: Point, size: number) {
		const locations = this.getAdjacentLocationsFromPoint(position, size)
		let newLocation: Point = position
		locations.forEach((location) => {
			if (this.getObjectAtLocation(location) == null) {
				newLocation = location
			}
		})
		return newLocation
	}

	/**
	 * Shuffles an array
	 * ! Should probably move this
	 * > https://javascript.info/task/shuffle
	 * @param array array to shuffle
	 */
	private shuffle(array: Array<any>) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
	}
}
