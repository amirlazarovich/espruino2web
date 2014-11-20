/**
 * Sample code for espruino serial - web interface
 *
 * @author  Amir Lazarovich
 * @date    2014, Nov 19
 */

// import
var nodeEspruino = require('node-espruino');
var glob = require("glob");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var spawn = require('child_process').spawn


// variables
var espruino;
var port = glob.GlobSync("/dev/tty.usb*").found[0];
var webport = 8000;






function main() {
	setupArguments();
	
	assertSerialConnection();
	printSettings();

	setupEspruino();
	setupWeb();
	setupSocket();

	// open website
	spawn('open', ['http://localhost:' + webport]);
}


function setupEspruino() {
	espruino = nodeEspruino.espruino({
	    comPort: port
	});	

	// communicate with espruino
	espruino.open(function(){
	    console.log("+ espruino connected");
	});
}


function setupWeb() {
	app.use("/static", express.static(__dirname + "/static"));
	app.use("/", express.static(__dirname + "/static"));
	
	http.listen(webport, function () {
	    console.log("++ go to http://localhost:" + webport);
	});
}

function setupSocket() {
	io.on('connection', function(socket) {
		socket.on("command", function(command) {
			console.log("> from web: " + command);
			espruino.command(command, function(result){
			    io.emit("data", "ack: " + result);
			    console.log("< from board: " + result);
			});
		});
	});
}






function printSettings() {
	console.log("Using:");
	console.log("+ serial port: " + port);
	console.log("+ web port: " + webport);
}

function printUsage() {
	var filename = __filename.substring(__filename.lastIndexOf("/") + 1, __filename.length);
	console.log("");
	console.log("Usage: " + filename + " [options]");
	console.log("");
	console.log("options:");
	console.log("-h, --help			print usage");
	console.log("-p, --port			set serial port [default: tty.usbserial*]");
	console.log("-w, --webport			set web port [default: 8000]");
	process.exit(0);
}

/**
 * parse script arguments and set local variables
 */
function setupArguments() {
	parseArguments(function(key, value) {
		switch (key) {
			case "p":
			case "port":
				port = value;
				break;

			case "w":
			case "webport":
				webport = value;
				break;

			case "h":
			case "help":
				printUsage();
				break;
		}
	});
}

/**
 * parse arguments for better handling
 * 
 * @param  {Function} callback (key, value)
 */
function parseArguments(callback) {
	for (var i = 2; i < process.argv.length; i++) {
		var key = process.argv[i];
		if (key[0] === "-") {
			key = key.substring(key.lastIndexOf("-") + 1, key.length);
			var value = process.argv[++i];
			if (value === undefined) {
				value = null;
			}

			callback(key, value);
		} 
	}
}

/**
 * make sure serial connected
 *  
 * @param  {boolean} exit throw error and exit
 */
function assertSerialConnection(exit) {
	if (port === undefined || exit) {
		console.log("[error] board not connected - please check serial connection or serial port");
		process.exit(-1);
	}	
}


// run
main();