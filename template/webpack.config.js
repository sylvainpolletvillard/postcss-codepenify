var webpack = require('webpack');
var path = require('path');

module.exports = function(env) {
	return {
		entry: {
			main: './codepen.js',
			postcss: 'postcss'
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist')
		},
		plugins: [
			new webpack.optimize.CommonsChunkPlugin({
				name: 'postcss' // Specify the common bundle's name.
			}),
			new webpack.optimize.UglifyJsPlugin({
				//TODO: find out why bundle has errors with compress:true
				compress: false,
				mangle: false,
				comments: false
			})
		],
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(base64)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								["env", {
									"targets": {
										"browsers": ["last 2 versions"]
									}
								}]
							]
						}
					}
				}
			]
		}
	}
}