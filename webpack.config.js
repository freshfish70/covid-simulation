const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: path.join(__dirname, '/src/ts/index.ts'),
	output: {
		filename: 'app.js',
		path: path.join(__dirname, 'lib'),
	},
	devServer: {
		contentBase: './src', //where contents are served from
		index: 'index.html',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
}
