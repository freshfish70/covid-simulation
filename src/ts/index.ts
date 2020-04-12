import { Simulator, ReportData } from './classes/Simulator'
// import {chart} from 'chart.js'

var ctx = document.getElementById('statistics-chart')
// ctx.style.backgroundColor = ''
var myLineChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: 'Infected',
				data: [],
				borderColor: '#B32144',
				borderWidth: 1,
				pointRadius: 0,
				color: '#00ff00',
				fill: false,
			},
			{
				label: 'Suceptible',
				data: [],
				borderColor: '#FFDE91',
				borderWidth: 1,
				pointRadius: 0,
				color: '#00ff00',
				fill: false,
			},
			{
				label: 'Recovered',
				data: [],
				borderColor: '#12ABB3',
				color: '#00ff00',
				fill: false,
				borderWidth: 1,
				pointRadius: 0,
			},
		],
	},
	options: {
		color: '#000',
		responsive: true,
		maintainAspectRatio: false,
		title: {
			display: true,
			text: 'Statistics',
		},
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
						suggestedMin: 0,
						suggestedMax: 200,
					},
				},
			],
			xAxes: [
				{
					display: false,
				},
			],
		},
	},
})

const simulator = new Simulator(650, 650, 200)
simulator.registerFrameUpdateCallback((data: ReportData) => {
	myLineChart.data.labels.push('label')
	myLineChart.data.datasets[2].data.push(data.recovered)
	myLineChart.data.datasets[1].data.push(data.susceptible)
	myLineChart.data.datasets[0].data.push(data.infected)
	myLineChart.update()
})

let start_button = document.getElementById('start-button')
let pause_button = document.getElementById('pause-button')
let restart_button = document.getElementById('restart-button')

start_button?.addEventListener('click', (e) => {
	simulator.start()
})

pause_button?.addEventListener('click', (e) => {
	simulator.pause()
})

restart_button?.addEventListener('click', (e) => {
	console.log('clicked')
})
