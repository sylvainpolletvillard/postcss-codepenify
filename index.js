#!/usr/bin/env node

const fs = require('fs')
const exec = require('child_process').execSync

const program = require('commander');
const { copy } = require('copy-paste')
const { open } = require('openurl')
const cleanup = require('rimraf').sync

const template = require('./template')

const WORKING_DIRECTORY = "__codepenify"
const INSTRUCTIONS_PEN_URL = `https://codepen.io/sylvainpv/pen/jmybav`

program
	.arguments('<plugin>')
	.action(function (plugin) {
		console.log('Generating a Codepen template with this PostCSS plugin: ', plugin);
		codepenify(plugin)
	})
	.parse(process.argv);

function codepenify(plugin) {
	try { fs.mkdirSync(WORKING_DIRECTORY) } catch(e){ console.info("__codepen directory already existing") }
	fs.writeFileSync(WORKING_DIRECTORY+"/codepen.js", template(plugin))
	console.log("Please wait...")
	exec(`cd ${WORKING_DIRECTORY}`
		+`&& npm install -g browserify babel-cli`
		+`&& npm install babel-preset-env ${plugin}`
		+`&& browserify codepen.js | babel --presets=env > codepen.bundle.js` //TODO: add babel-preset-babili
		, {stdio: "inherit" })
	console.log("Bundle generated, copying to clipboard...")
	copy(fs.readFileSync(WORKING_DIRECTORY+"/codepen.bundle.js"))
	console.log("Opening instructions for Codepen... " + INSTRUCTIONS_PEN_URL)
	open(INSTRUCTIONS_PEN_URL)
	cleanup(WORKING_DIRECTORY)
}