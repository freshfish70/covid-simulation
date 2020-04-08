import { GridLocation } from './GridLocation'
import { Point } from './Point'

/**
 * A 2 dimensional grid.
 * The grid stores entities.
 */
export class Grid {
	private _sizeX: number = 1

	private _sizeY: number = 1

	private _grid: Array<Array<GridLocation | null>>

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
	 * Returns a random adjecent location from the provided X and Y coorinate.
	 * The location will allways be inside the grid.
	 *
	 * @param x x position to get adjecent from
	 * @param y y position to get adjenct from
	 * @param size how large the "adjecent" search is
	 */
	public getRndAdjecentLocationFromXY(x: number, y: number, size: number) {
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
						if (this._grid[currentRow][currentColumn] == null) {
							selected.push(new Point(currentRow, currentColumn))
						}
					}
				}
			}
		}

		this.shuffle(selected)
		return selected[0]
	}

	/**
	 * Returns a random adjecent location from the provided X and Y coorinate.
	 * The location will allways be inside the grid.
	 *
	 * @point position the position to get adjecent of
	 * @param size how large the "adjecent" search is
	 */
	public getRndAdjecentLocationFromPoint(position: Point, size: number) {
		return this.getRndAdjecentLocationFromXY(position.x, position.y, size)
	}

	/**
	 * Shuffles an array
	 * ! Should probably move this
	 * > https://javascript.info/task/shuffle
	 * @param array array to shuffle
	 */
	public shuffle(array: Array<any>) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
	}
}
