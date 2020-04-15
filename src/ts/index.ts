import {
	Simulator,
	ReportData,
	SimulatorConfig,
	Scenario,
} from './classes/Simulator'
import { chartConfig } from './ChartConfig'
import { Chart } from 'chart.js'

let preferedWidth = 500
let preferedHeight = 250
let width = document.documentElement.clientWidth

if (width < preferedWidth) {
	let widthDiff = preferedWidth - width
	let per = (widthDiff % 10) - 80

	preferedWidth -= widthDiff - per
	preferedHeight += widthDiff - per
}

let charts = document.getElementsByClassName('chart-adjust')
for (const chart of charts) {
	chart.setAttribute('style', `width: ${preferedWidth}px`)
}

var ctx = document.getElementById('statistics-chart-free-for-all')
// ctx.style.backgroundColor = ''

var freeforallchart = new Chart(ctx, JSON.parse(JSON.stringify(chartConfig)))
let freeforallcontainer = document.getElementById(
	'simulator-container-free-for-all'
)
let freeforallsimulator = new Simulator({
	width: preferedWidth,
	height: preferedHeight,
	entities: 200,
	scenario: Scenario.FREEFORALL,
	canvasContainer: freeforallcontainer ? freeforallcontainer : undefined,
	allowDeaths: false,
} as SimulatorConfig)

freeforallsimulator.registerFrameUpdateCallback((data: ReportData) => {
	freeforallchart.data.labels.push(data.day)
	freeforallchart.data.datasets[0].data.push(data.susceptible)
	freeforallchart.data.datasets[1].data.push(data.infected)
	freeforallchart.data.datasets[2].data.push(data.recovered)
	freeforallchart.update()
})

document
	.getElementById('start-button-free-for-all')
	?.addEventListener('click', (e) => {
		freeforallsimulator.start()
	})

document
	.getElementById('pause-button-free-for-all')
	?.addEventListener('click', (e) => {
		freeforallsimulator.pause()
	})

document
	.getElementById('restart-button-free-for-all')
	?.addEventListener('click', (e) => {
		freeforallsimulator.restart()
		freeforallchart.data.labels = []
		freeforallchart.data.datasets[0].data = []
		freeforallchart.data.datasets[1].data = []
		freeforallchart.data.datasets[2].data = []
		freeforallchart.update()
	})

var ctx = document.getElementById('statistics-chart-forced-quarantine')
var forcedQuarantinechart = new Chart(
	ctx,
	JSON.parse(JSON.stringify(chartConfig))
)
let forcedQuarantinecontainer = document.getElementById(
	'simulator-container-forced-quarantine'
)
const forcedQuarantineSimulator = new Simulator({
	width: preferedWidth,
	height: preferedHeight,
	entities: 200,
	scenario: Scenario.FORCED_QUARANTINE,
	canvasContainer: forcedQuarantinecontainer
		? forcedQuarantinecontainer
		: undefined,
	allowDeaths: false,
} as SimulatorConfig)
forcedQuarantineSimulator.registerFrameUpdateCallback((data: ReportData) => {
	forcedQuarantinechart.data.labels.push(data.day)
	forcedQuarantinechart.data.datasets[0].data.push(data.susceptible)
	forcedQuarantinechart.data.datasets[1].data.push(data.infected)
	forcedQuarantinechart.data.datasets[2].data.push(data.recovered)
	forcedQuarantinechart.update()
})

document
	.getElementById('start-button-forced-quarantine')
	?.addEventListener('click', (e) => {
		forcedQuarantineSimulator.start()
	})

document
	.getElementById('pause-button-forced-quarantine')
	?.addEventListener('click', (e) => {
		forcedQuarantineSimulator.pause()
	})

document
	.getElementById('restart-button-forced-quarantine')
	?.addEventListener('click', (e) => {
		forcedQuarantineSimulator.restart()
		forcedQuarantinechart.data.labels = []
		forcedQuarantinechart.data.datasets[0].data = []
		forcedQuarantinechart.data.datasets[1].data = []
		forcedQuarantinechart.data.datasets[2].data = []
		forcedQuarantinechart.update()
	})

var ctx = document.getElementById('statistics-chart-quarter-free')
var quarterFreechart = new Chart(ctx, JSON.parse(JSON.stringify(chartConfig)))
let quarterFreecontainer = document.getElementById(
	'simulator-container-quarter-free'
)
const quarterFreeSimulator = new Simulator({
	width: preferedWidth,
	height: preferedHeight,
	entities: 200,
	scenario: Scenario.QUARTER_FREE,
	canvasContainer: quarterFreecontainer ? quarterFreecontainer : undefined,
	allowDeaths: false,
} as SimulatorConfig)
quarterFreeSimulator.registerFrameUpdateCallback((data: ReportData) => {
	quarterFreechart.data.labels.push(data.day)
	quarterFreechart.data.datasets[0].data.push(data.susceptible)
	quarterFreechart.data.datasets[1].data.push(data.infected)
	quarterFreechart.data.datasets[2].data.push(data.recovered)
	quarterFreechart.update()
})

document
	.getElementById('start-button-quarter-free')
	?.addEventListener('click', (e) => {
		quarterFreeSimulator.start()
	})

document
	.getElementById('pause-button-quarter-free')
	?.addEventListener('click', (e) => {
		quarterFreeSimulator.pause()
	})

document
	.getElementById('restart-button-quarter-free')
	?.addEventListener('click', (e) => {
		quarterFreeSimulator.restart()
		quarterFreechart.data.labels = []
		quarterFreechart.data.datasets[0].data = []
		quarterFreechart.data.datasets[1].data = []
		quarterFreechart.data.datasets[2].data = []
		quarterFreechart.update()
	})

var ctx = document.getElementById('statistics-chart-one-eighth-free')
var oneEighthChart = new Chart(ctx, JSON.parse(JSON.stringify(chartConfig)))
let oneEightContainer = document.getElementById(
	'simulator-container-one-eighth-free'
)
const oneEightSimulator = new Simulator({
	width: preferedWidth,
	height: preferedHeight,
	entities: 200,
	scenario: Scenario.ONE_IN_EIGHT_FREE,
	canvasContainer: oneEightContainer ? oneEightContainer : undefined,
	allowDeaths: false,
} as SimulatorConfig)
oneEightSimulator.registerFrameUpdateCallback((data: ReportData) => {
	oneEighthChart.data.labels.push(data.day)
	oneEighthChart.data.datasets[0].data.push(data.susceptible)
	oneEighthChart.data.datasets[1].data.push(data.infected)
	oneEighthChart.data.datasets[2].data.push(data.recovered)
	oneEighthChart.update()
})

document
	.getElementById('start-button-one-eighth-free')
	?.addEventListener('click', (e) => {
		oneEightSimulator.start()
	})

document
	.getElementById('pause-button-one-eighth-free')
	?.addEventListener('click', (e) => {
		oneEightSimulator.pause()
	})

document
	.getElementById('restart-button-one-eighth-free')
	?.addEventListener('click', (e) => {
		oneEightSimulator.restart()
		oneEighthChart.data.labels = []
		oneEighthChart.data.datasets[0].data = []
		oneEighthChart.data.datasets[1].data = []
		oneEighthChart.data.datasets[2].data = []
		oneEighthChart.update()
	})
