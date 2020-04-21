import p5, { Color } from 'p5'
import { Grid } from './Grid'
import { Person, Compartment } from './Person'
import { Point } from './Point'
import { SimColors } from './SimColors'
import { Obstacle } from './Obstacle'
import { flatMortality, getMortalityByAge, selectRandomAge } from '../age'
import { randomIntFromInterval } from '../random'

export interface ReportData {
	susceptible: number
	infected: number
	recovered: number
	dead: number
	peakInfected: number
	day: number
}

export interface SimulatorConfig {
	width: number
	height: number
	entities: number
	scenario: Scenario
	canvasContainer: HTMLElement | undefined
	allowDeaths: boolean
	allowAge: boolean
}

export enum Scenario {
	FREEFORALL,
	FORCED_QUARANTINE,
	QUARTER_FREE,
	ONE_IN_EIGHT_FREE,
}

export class Simulator {
	private _p5: p5

	private _config: SimulatorConfig

	// The size of a cell that an entity will be living in
	private readonly _cellSize: number = 10

	// How fast the simulaition will go
	private readonly _runspeed: number = 2

	// The desired frame rate to run the simulation at
	private readonly _framerate: number = 30

	// The grid, where all entities are stored in idividual cells.
	private _simulationArea!: Grid

	// All persons that are in the simulations
	private _persons: Array<Person> = new Array()

	// All obstacles in the simulator
	private _obstacles: Array<Obstacle> = new Array()

	// Callback to notify outisde sources for when frames are don rendering
	private frameUpdateCallback: (arg: ReportData) => void | null

	private timeStep = 0

	private totalTimeSteps = 0

	private dayTime = new Date()

	private isPaused = false

	private isStarted = false
	private isRestarted = false

	// ! Temporary

	// Peak number of infected simultaneously
	private peakInfectedConcurrent = 0

	private infected = 0

	private suceptible = 0

	private reocvered = 0

	private dead = 0

	private infectedPeople = 0

	// !END TEMPORARY

	constructor(config: SimulatorConfig) {
		// Just make sure we get even sized cells
		if (config.width % this._cellSize > 0)
			throw new Error(`X size is not divideable by ${this._cellSize}`)

		if (config.height % this._cellSize > 0)
			throw new Error(`Y size is not divideable by ${this._cellSize}`)
		this._config = config

		this.createGrid()

		this.initialize(config.canvasContainer)
	}

	/**
	 * Start the simulation
	 */
	public start() {
		this._p5.loop()
		this.timeStep = 0
		this.dayTime = new Date()
		this.isPaused = false
		this.isStarted = true
	}

	/**
	 * Pauses the simulation
	 */
	public pause() {
		this._p5.noLoop()
		this.isPaused = true
	}

	/**
	 * Restarts the simulator
	 */
	public restart() {
		this.pause()
		this.isStarted = false
		this.totalTimeSteps = 0
		this.dayTime = new Date()
		this.populateGrid()
		this.isRestarted = true
		this._p5.draw()
		this.isRestarted = false
	}

	public enableDeath(allowDeath: boolean) {
		this._config.allowDeaths = allowDeath
	}

	public enableAge(allowAge: boolean) {
		this._config.allowAge = allowAge
	}

	/**
	 * Initializes P5 and bind the setup and
	 * draw functions
	 */
	private initialize(canvasContainer: HTMLElement | undefined) {
		const runable = (sketch: p5) => {
			/**
			 * Runs once
			 */
			sketch.setup = () => {
				sketch.createCanvas(this._config.width, this._config.height, 'p2d')
				sketch.frameRate(this._framerate)
				sketch.background(SimColors.SIMBG)

				this.populateGrid()
				console.log('Setup complete')

				this.pause()
				// Make sure we draw the first frame, so something is displayed
				sketch.draw()
			}
			/**
			 * Runs each frame
			 */
			sketch.draw = () => {
				if (
					sketch.frameCount % this._runspeed == 0 ||
					this.isRestarted == true
				) {
					let currentTimeStep =
						(new Date().getTime() - this.dayTime.getTime()) / 1000
					// !Improve this
					this.suceptible = 0
					this.infected = 0
					this.reocvered = 0
					this.dead = 0
					this.infectedPeople = 0

					sketch.background(SimColors.SIMBG)
					// this.showGrid()

					for (const person of this._persons) {
						if (person.isInQuarantine) {
							this.drawQuanrantineMarker(person.position)
						}
						this.drawPerson(person)
						if (currentTimeStep > this.timeStep) {
							person?.addTimeStep()
						}

						if (this.isStarted) person?.act()
					}

					this.drawObstacles()

					if (this.infected > this.peakInfectedConcurrent) {
						this.peakInfectedConcurrent = this.infected
					}

					// this.infectedPeople = (this.infected / this.infectedPeople).toFixed(3)
					if (currentTimeStep > this.timeStep) {
					if (this.frameUpdateCallback != null) {
						let arg: ReportData = {
							susceptible: this.suceptible,
							infected: this.infected,
							dead: this.dead,
							recovered: this.reocvered,
							peakInfected: this.peakInfectedConcurrent,
								day: this.totalTimeSteps,
						}
						this.frameUpdateCallback(arg)
					}

					this.lastInfected = this.infected
					// this.infectedPeople = (this.infected / this.infectedPeople).toFixed(3)
					if (currentTimeStep > this.timeStep) {
						this.timeStep++
						this.totalTimeSteps++
					}
				}
				this.showStats(sketch)
				if (this.infected == 0 && this.reocvered > 0) {
					console.log('DONE')
					console.log('Peak :' + this.peakInfectedConcurrent)
					this.pause()
				}
			}
		}
		this._p5 = new p5(runable, canvasContainer)
	}

	/**
	 *  Draws all obstacles
	 */
	private drawObstacles() {
		for (const obs of this._obstacles) {
			this._p5.stroke('#fff')
			this._p5.strokeWeight(1)
			this._p5.rectMode('center')
			this._p5.rect(
				obs.position.x * this._cellSize + 5,
				obs.position.y * this._cellSize + 5,
				2,
				2
			)
		}
	}

	/**
	 * Draws a person on the canvas, ang selects the correct color for the person
	 * @param person the person to draw
	 */
	private drawPerson(person: Person) {
		let color = '#000000'

		switch (person.state) {
			case Compartment.SUSCEPTIBLE:
				this.suceptible++
				color = SimColors.SUSCEPTIBLE
				break
			case Compartment.INFECTED:
				this.infectedPeople += person.peopleInfected + person.avgInfections
				this.infected++
				color = SimColors.INFECTED
				break
			case Compartment.RECOVERED:
				this.reocvered++
				color = SimColors.RECOVERED

				break
			case Compartment.DEAD:
				this.dead++
				color = SimColors.DEAD

				break
			default:
				color = '#ffffff'
				break
		}
		this._p5.stroke(color)
		this._p5.strokeWeight(5)
		this._p5.point(
			person.position.x * this._cellSize + this._cellSize / 2,
			person.position.y * this._cellSize + this._cellSize / 2
		)
	}

	/**
	 * Draws quarantine marker on the canvas at given positopn
	 * @param position the position to draw
	 */
	private drawQuanrantineMarker(position: Point) {
		this._p5.fill(SimColors.QUARANTINE)
		this._p5.strokeWeight(1)
		this._p5.stroke(SimColors.QUARANTINE)
		this._p5.rectMode('center')
		this._p5.rect(
			position.x * this._cellSize + 5,
			position.y * this._cellSize + 5,
			this._cellSize,
			this._cellSize
		)
	}

	public registerFrameUpdateCallback(cb: (data: ReportData) => void) {
		this.frameUpdateCallback = cb
	}

	/**
	 * Display stats like FPS, Susceptible, recovered, infectd, dead
	 * @param sketch p5 instance
	 */
	private showStats(sketch: p5) {
		let fps = sketch.frameRate()
		sketch.fill(255)
		sketch.stroke(0)
		sketch.text('FPS: ' + fps.toFixed(2), 10, this._config.height - 10)

		sketch.fill(255)
		sketch.stroke(0)

		let basePos = 80
		sketch.text('SU: ' + this.suceptible, basePos, this._config.height - 10)
		sketch.text('IN: ' + this.infected, basePos + 100, this._config.height - 10)
		sketch.text(
			'RE: ' + this.reocvered,
			basePos + 100 * 2,
			this._config.height - 10
		)
		sketch.text('DE: ' + this.dead, basePos + 100 * 3, this._config.height - 10)
		sketch.text(
			'R: ' + this.infectedPeople,
			basePos + 100 * 4,
			this._config.height - 10
		)
	}

	/**
	 * Displays the grid on the canvas
	 */
	private showGrid() {
		// Diplay grid
		this._p5.stroke('#0C2E45')
		this._p5.strokeWeight(0.1)
		for (var x = 0; x < this._config.width; x += this._cellSize) {
			for (var y = 0; y < this._config.height; y += this._cellSize) {
				this._p5.line(x, 0, x, this._config.height)
				this._p5.line(0, y, this._config.width, y)
			}
		}
	}

	/**
	 * Generates the simulation area grid
	 */
	private createGrid() {
		this._simulationArea = new Grid(
			this._config.width / this._cellSize,
			this._config.height / this._cellSize
		)
	}

	/**
	 * Populates the grid with people at random positions
	 */
	private populateGrid() {
		this._persons = new Array()
		this._obstacles = new Array()
		this.createGrid()

		let chosenLocations = 0
		// Used for debugging tries the selection of cells uses, and also for
		// failsafing the while loop :D
		let tries = 0

		let infectLimit = null

		if (this._config.scenario == Scenario.FORCED_QUARANTINE) {
			this.createWallObstacle()
			infectLimit = new Point(10, this._config.height / this._cellSize)
		}

		while (chosenLocations < this._config.entities && tries < 100000) {
			let chosenX = Math.floor(Math.random() * this._simulationArea.sizeX)
			let chosenY = Math.floor(Math.random() * this._simulationArea.sizeY)
			let location = new Point(chosenX, chosenY)

			if (this._simulationArea.getObjectAtLocation(location) == null) {
				let p = new Person(this._simulationArea, location)
				let personAge = -1
				let personMortality = flatMortality

				if (this._config.allowAge) {
					let pa = selectRandomAge()
					personAge = randomIntFromInterval(pa!.minAge, pa!.maxAge)
					p.setAge(personAge)
				}
				if (this._config.allowDeaths) {
					personMortality = getMortalityByAge(personAge)
				}

				p.allowDeath(this._config.allowDeaths, personMortality)

				this._persons.push(p)
				this._simulationArea.addToLocation(p, location)
				chosenLocations++
			}
			tries++
		}

		if (this._config.scenario == Scenario.ONE_IN_EIGHT_FREE) {
			this.quarantinePopulation(
				this._config.entities - this._config.entities / 8
			)
		} else if (this._config.scenario == Scenario.QUARTER_FREE) {
			this.quarantinePopulation(
				this._config.entities - this._config.entities / 4
			)
		}
		//! INFECT ONLY A SINGLE PERSON
		this.infectOneRandom(infectLimit)
	}

	/**
	 * Infects a single person. The infection can be limited
	 * by X and Y, where the person has to be in the X and Y range.
	 * @param limit area limit
	 */
	private infectOneRandom(limit?: Point | null) {
		for (const p of this._persons) {
			if (p.isInQuarantine) {
				continue
			}
			if (limit) {
				if (p.position.x <= limit.x && p.position.y <= limit.y) {
					p.infect(true)
					break
				}
			} else {
				p.infect(true)
				break
			}
		}
	}

	/**
	 * Puts the number of population in quarantine
	 * @param personsToQuarantine number of people to quarantine
	 */
	private quarantinePopulation(personsToQuarantine: number) {
		for (let index = 0; index < personsToQuarantine; index++) {
			const p = this._persons[index]
			p.isInQuarantine = true
		}
	}

	private createWallObstacle() {
		const cellsHeight = this._config.height / this._cellSize
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
				if (this.isPaused) return
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
					clearInterval(me)
				}
				this._obstacles.splice(min, max - min)
			},
			2000,
			this
		)
	}
}
