const chartConfig = {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				label: 'Suceptible',
				data: [],
				borderColor: '#139bff',
				borderWidth: 1,
				pointRadius: 0,
				color: '#00ff00',
				fill: false,
			},
			{
				label: 'Infected',
				data: [],
				borderColor: '#e5345e',
				borderWidth: 1,
				pointRadius: 0,
				color: '#00ff00',
				fill: false,
			},
			{
				label: 'Recovered',
				data: [],
				borderColor: '#4af87b',
				color: '#00ff00',
				fill: false,
				borderWidth: 1,
				pointRadius: 0,
			},
		],
	},
	options: {
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: 'true',
		},
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
						fontColor: '#fff',
					},
					gridLines: {
						color: '#161616',
					},
					color: '#fff',
				},
			],
			xAxes: [
				{
					display: false,
				},
			],
		},
	},
}

export { chartConfig }
