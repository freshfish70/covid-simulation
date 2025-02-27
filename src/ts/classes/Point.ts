/**
 * A point in 2 dimensions (X, Y)
 */
export class Point {
	private _x: number

	private _y: number

	constructor(x: number, y: number) {
		this._x = x
		this._y = y
	}

	public get x(): number {
		return this._x
	}

	public set x(x: number) {
		this._x = x
	}

	public get y(): number {
		return this._y
	}

	public set y(y: number) {
		this._y = y
	}
}
