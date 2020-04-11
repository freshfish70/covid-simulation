import p5, { Color } from 'p5'
import { Grid } from './Grid'
import { Person, Compartment } from './Person'
import { Point } from './Point'
import { QuadTree } from './QuadTree'
import { Obstacle } from './Obstacle'

export class Simulator {
	private _p5: p5

	private _width: number

	private _height: number

	// The size of a cell that an entity will be living in
	private readonly _cellSize: number = 10

	// How fast the simulaition will go
	private readonly _runspeed: number = 2

	// The desired frame rate to run the simulation at
	private readonly _framerate: number = 30

	// The grid, where all entities are stored in idividual cells.
	private _simulationArea: Grid

	// Number of entities/persons in the simulation
	private readonly _entities: number

	// All persons that are in the simulations
	private _persons: Array<Person> = new Array()

	private _obstacles: Array<Obstacle> = new Array()

	private peakInfectedConcurrent = 0

	// ! Temporary

	private infected = 0

	private suceptible = 0

	private reocvered = 0

	private dead = 0
	private infectedPeople = 0

	// !END TEMPORARY

	constructor(x: number, y: number, numberOfEntities: number) {
		// Just make sure we get even sized cells
		if (x % this._cellSize > 0)
			throw new Error(`X size is not divideable by ${this._cellSize}`)

		if (y % this._cellSize > 0)
			throw new Error(`Y size is not divideable by ${this._cellSize}`)

		this._width = x
		this._height = y
		this._entities = numberOfEntities

		this._simulationArea = new Grid(
			this._width / this._cellSize,
			this._height / this._cellSize
		)

		this.initialize()
	}

	public start() {
		this._p5.loop()
	}

	public pause() {
		this._p5.noLoop()
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
				sketch.createCanvas(this._width, this._height, 'p2d')
				this.populateGrid()
				sketch.frameRate(this._framerate)
				sketch.background('#081B2E')
				console.log('Setup complete')

				// sketch.noLoop()
			}
			/**
			 * Runs each frame
			 */
			sketch.draw = () => {
				if (sketch.frameCount % this._runspeed == 0) {
					// !Improve this
					this.suceptible = 0
					this.infected = 0
					this.reocvered = 0
					this.dead = 0
					this.infectedPeople = 0

					sketch.background('#081B2E')
					// this.showGrid()

					for (const person of this._persons) {
						//! TEMPORARY COLORING METHOD
						if (person.isInQuarantine) {
							sketch.fill('#081B2E')
							sketch.strokeWeight(0.3)
							sketch.stroke('#999')
							sketch.rectMode('center')
							sketch.rect(
								person.position.x * this._cellSize + 5,
								person.position.y * this._cellSize + 5,
								this._cellSize,
								this._cellSize
							)
						}
						switch (person.state) {
							case Compartment.SUSCEPTIBLE:
								this.suceptible++
								sketch.stroke('#FFDE91')
								break
							case Compartment.INFECTED:
								this.infectedPeople +=
									person.peopleInfected + person.avgInfections

								this.infected++
								sketch.stroke('#B32144')
								// sketch.stroke('#4265B3')
								break
							case Compartment.RECOVERED:
								this.reocvered++
								sketch.stroke('#12ABB3')
								break
							case Compartment.DEAD:
								this.dead++
								sketch.stroke('#000')
								break
							default:
								sketch.stroke('#fff')
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
					for (const obs of this._obstacles) {
						sketch.stroke('#fff')

						sketch.strokeWeight(1)
						sketch.rectMode('center')
						sketch.rect(
							obs.position.x * this._cellSize + 5,
							obs.position.y * this._cellSize + 5,
							2,
							2
						)
					}

					// console.log(this.infectedPeople)
					if (this.infected > this.peakInfectedConcurrent) {
						this.peakInfectedConcurrent = this.infected
					}
					// this.infectedPeople = (this.infected / this.infectedPeople).toFixed(3)
					this.infectedPeople = (this.infectedPeople / this.infected).toFixed(3)
				}
				this.showStats(sketch)
				if (this.infected == 0 && this.reocvered > 0) {
					console.log('DONE')
					console.log('Peak :' + this.peakInfectedConcurrent)
					this.pause()
				}
			}
		}
		this._p5 = new p5(runable)
	}

	/**
	 * Display stats like FPS, Susceptible, recovered, infectd, dead
	 * @param sketch p5 instance
	 */
	private showStats(sketch: p5) {
		let fps = sketch.frameRate()
		sketch.fill(255)
		sketch.stroke(0)
		sketch.text('FPS: ' + fps.toFixed(2), 10, this._height - 10)

		sketch.fill(255)
		sketch.stroke(0)

		let basePos = 80
		sketch.text('SU: ' + this.suceptible, basePos, this._height - 10)
		sketch.text('IN: ' + this.infected, basePos + 100, this._height - 10)
		sketch.text('RE: ' + this.reocvered, basePos + 100 * 2, this._height - 10)
		sketch.text('DE: ' + this.dead, basePos + 100 * 3, this._height - 10)
		sketch.text(
			'R: ' + this.infectedPeople,
			basePos + 50 * 4,
			this._height - 10
		)
	}

	/**
	 * Displays the grid on the canvas
	 */
	private showGrid() {
		// Diplay grid
		this._p5.stroke('#0C2E45')
		this._p5.strokeWeight(0.1)
		for (var x = 0; x < this._width; x += this._cellSize) {
			for (var y = 0; y < this._height; y += this._cellSize) {
				this._p5.line(x, 0, x, this._height)
				this._p5.line(0, y, this._width, y)
			}
		}
	}

	private forcedQuarantine = false

	private quarterMoving = false

	private oneInEightMoving = true

	/**
	 * Populates the grid with people at random positions
	 */
	private populateGrid() {
		// Counter for how many positions that are chosen
		let chosenLocations = 0
		// Used for debugging tries the selection of cells uses, and also for
		// failsafing the while loop :D
		let tries = 0
		console.log(this._entities)

		let qpopulationQuarantine = this._entities - this._entities / 4
		console.log(qpopulationQuarantine)

		let epopulationQuarantine = this._entities - this._entities / 8

		let quarantined = 0

		if (this.forcedQuarantine) this.forcedQurantine()

		while (chosenLocations < this._entities && tries < 100000) {
			let chosenX = Math.floor(Math.random() * this._simulationArea.sizeX)
			let chosenY = Math.floor(Math.random() * this._simulationArea.sizeY)
			let location = new Point(chosenX, chosenY)

			if (this._simulationArea.getObjectAtLocation(location) == null) {
				let p = new Person(this._simulationArea, location)
				if (this.quarterMoving && quarantined <= qpopulationQuarantine) {
					p.isInQuarantine = true
					quarantined++
				}
				if (this.oneInEightMoving && quarantined <= epopulationQuarantine) {
					p.isInQuarantine = true
					quarantined++
				}

				this._persons.push(p)
				this._simulationArea.addToLocation(p, location)
				chosenLocations++
			}
			tries++
		}

		//! INFECT ONLY A SINGLE PERSON
		this._persons[90].infect()

		console.log(`Generated ${this._entities} in ${tries} tries`)
	}

	private forcedQurantine() {
		const cellsHeight = this._height / this._cellSize
		for (let index = 0; index < cellsHeight; index++) {
			let po = new Point(15, index)
			let ob = new Obstacle(this._simulationArea, po)
			this._simulationArea.addToLocation(ob, po)
			this._obstacles.push(ob)
		}
		this.timer()
	}

	private timer() {
		let times = 0
		const me = setInterval(
			() => {
				const min = Math.floor(this._obstacles.length / 2) - times
				const max = Math.floor(this._obstacles.length / 2) + times

				for (let index = min; index < max; index++) {
					const element = this._obstacles[index]
					if (!element) continue
					this._simulationArea.freeLocation(element.position)
				}

				if (times < 3) {
					times++
				} else {
					console.log('Cleared interval')
					clearInterval(me)
				}
				this._obstacles.splice(min, max - min)
			},
			2000,
			this
		)
	}
}
