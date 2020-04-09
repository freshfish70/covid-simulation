/**
 * A Quad tree is a tree structure that divides space(2D) into squares.
 * Each node (square) holds a reference of exactly fource childrem.
 *
 * Inspiration for implementation
 * #TheCodingTrain: https://www.youtube.com/watch?v=OJxEcs0w_kE
 */
class QuadTree {
	private _x: number
	private _y: number
	private _width: number
	private _height: number
	private readonly _capacity: number = 4

	constructor(x: number, y: number, width: number, height: number) {
		this._x = x
		this._y = y
		this._width = width
		this._height = height
	}

	// !Add points

	// !Search for a Point
}
