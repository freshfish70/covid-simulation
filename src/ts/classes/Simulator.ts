import p5, { Color } from 'p5'
import { Grid } from './Grid'
import { Person, Compartment } from './Person'
import { Point } from './Point'

export class Simulator {
	private _p5: p5

	private _x: number

	private _y: number

	private readonly _cellSize: number = 10

	private readonly _runspeed: number = 5

	private _simulationArea: Grid

	private readonly _entities: number

	constructor(x: number, y: number, numberOfEntities: number) {
		// Just make sure we get even sized cells
		if (x % this._cellSize > 0)
			throw new Error(`X size is not divideable by ${this._cellSize}`)

		if (y % this._cellSize > 0)
			throw new Error(`Y size is not divideable by ${this._cellSize}`)

		this._x = x
		this._y = y
		this._entities = numberOfEntities

		this._simulationArea = new Grid(
			this._x / this._cellSize,
			this._y / this._cellSize
		)

		this.initialize()
	}

	/**
	 * Initializes P5 and bind the setup and
	 * draw functions
	 */
	private initialize() {
		const runable = (sketch: p5) => {
			/**
			 * Runs once
			 */
			sketch.setup = () => {
				sketch.createCanvas(this._x, this._y)
				this.PopulateGrid()
				console.log('Setup complete')
			}
			/**
			 * Runs each frame
			 */
			sketch.draw = () => {
				if (sketch.frameCount % this._runspeed == 0) {
					sketch.background('#081B2E')

					for (var x = 0; x < this._x; x += this._cellSize) {
						for (var y = 0; y < this._y; y += this._cellSize) {
							sketch.stroke('#0C2E45')
							sketch.strokeWeight(0.1)
							sketch.line(x, 0, x, this._y)
							sketch.line(0, y, this._x, y)
						}
					}

					let grid = this._simulationArea.grid
					const xsize = grid.length

					for (let x = 0; x < xsize; x++) {
						const ysize = grid[x].length
						for (let y = 0; y < ysize; y++) {
							let gridLocation = grid[x][y]
							if (gridLocation) {
								if (gridLocation instanceof Person) {
									//! TEMPORARY COLORING METHOD
									let person = gridLocation as Person
									switch (person.state) {
										case Compartment.SUSCEPTIBLE:
											sketch.stroke('#FFDE91')
											break
										case Compartment.INFECTED:
											sketch.stroke('#B32144')
											// sketch.stroke('#4265B3')
											break
										case Compartment.RECOVERED:
											sketch.stroke('#12ABB3')
											break
										case Compartment.DEAD:
											sketch.stroke('#000')
											break
										default:
											break
									}
									//! END TEMPORARY COLORING METHOD
									sketch.strokeWeight(5)
									sketch.point(
										person.position.x * this._cellSize + 5,
										person.position.y * this._cellSize + 5
									)
									person?.act()
								}
							}
						}
					}
				}
				let fps = sketch.frameRate()
				sketch.fill(255)
				sketch.stroke(0)
				sketch.text('FPS: ' + fps.toFixed(2), 10, this._y - 10)
			}
		}

		this._p5 = new p5(runable)
	}

	private PopulateGrid() {
		let grid = this._simulationArea.grid
		let chosenLocations = 0
		// Used for debugging tries the selection of cells uses, and also for
		// failsafing the while loop :D
		let tries = 0
		while (chosenLocations < this._entities && tries < 10000) {
			let chosenX = Math.floor(Math.random() * this._simulationArea.sizeX)
			let chosenY = Math.floor(Math.random() * this._simulationArea.sizeY)

			if (grid[chosenX][chosenY] == null) {
				let p = new Person(this._simulationArea, new Point(chosenX, chosenY))
				// ! TEMPORARY COLONG METHOD
				let a = Math.random()
				if (a < 0.2) {
					p.state = Compartment.SUSCEPTIBLE
				} else if (a < 0.4) {
					p.state = Compartment.INFECTED
				} else if (a < 0.6) {
					p.state = Compartment.RECOVERED
				} else {
					p.state = Compartment.DEAD
				}
				// ! END TEMPORARY COLORING

				grid[chosenX][chosenY] = p
				chosenLocations++
			}
			tries++
		}
		console.log(`Generated ${this._entities} in ${tries} tries`)
	}
}
