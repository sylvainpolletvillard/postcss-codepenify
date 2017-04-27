#!/usr/bin/env node

const fs = require('fs-extra')
const exec = require('child_process').execSync

const program = require('commander');
const { open } = require('openurl')
const fileUrl = require('file-url');
const replace = require('replace-in-file');

const prefillTemplate = require("./prefill.html.template")

const WORKING_DIRECTORY = "__codepenify"
//const INSTRUCTIONS_PEN_URL = `https://codepen.io/sylvainpv/pen/jmybav`

program
	.arguments('[plugins...]')
	.action(function (plugins) {
		console.log('Generating a Codepen template with these PostCSS plugins: ', plugins.join(" ; "));
		codepenify(plugins)
	})
	.parse(process.argv);

function codepenify(plugins) {
	try { fs.mkdirSync(WORKING_DIRECTORY) } catch(e){ console.info("__codepen directory already existing") }
	console.log("Please wait...")
	fs.copySync(__dirname +"/template", WORKING_DIRECTORY)
	replace.sync({
		files: [WORKING_DIRECTORY+"/codepen.js"],
		from: "__PLUGIN__",
		to: plugins[0]
	});
	exec(`cd ${WORKING_DIRECTORY}`
		+` && npm install`
		+` && npm install ${plugins.join(" ")}`
		+` && npm run build`
		, { stdio: "inherit" })
	console.log("Bundle generated")
	console.log("Opening Codepen prefill form...")
	fs.writeFileSync(WORKING_DIRECTORY+"/prefill.html", prefillTemplate({
		plugins,
		bundleCode: [
			fs.readFileSync(WORKING_DIRECTORY+"/dist/postcss.js"),
			fs.readFileSync(WORKING_DIRECTORY+"/dist/main.js"),
		].join("\n\n")
	}))
	open(fileUrl(WORKING_DIRECTORY+"/prefill.html"))
	setTimeout(() => fs.removeSync(WORKING_DIRECTORY), 10 * 1000)
}