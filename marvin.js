(function(){
	"use strict";

	// Node modules
	var findit = require('findit');
	var argv = require('optimist').argv;

	// Require utils tools
	require('./utils.js');

	/**
	 * This is Marvin !
	 */
	 var Marvin = (function(){

	 	/**
	 	 * If this var is set to true we will display debug message
	 	 * @type {Boolean}
	 	 */
	 	var debug = false;

	 	/**
	 	 * Bind a module name to its newOrder function
	 	 * Key is moduleName
	 	 * Value is the function
	 	 * @type {Object}
	 	 */
	 	var orderReceivers = {};

	 	// This is public
	 	return {

	 		"start": function(argv){
	 			// Store Marvin instance
	 			var Marvin = this;

	 			// Store debug
	 			debug = argv.debug;

	 			if(debug)
	 				console.log('Starting Marvin');

	 			// Start all modules
	 			findit.find('../modules').on('file', function(file, stat){
	 				//If its file is start.js we need it. This should start module
					if(file.endsWith('start.js')){
						var module = require(file);
						module.start(Marvin);

						if(debug)
							console.log(module.moduleName + ' started');
					}
				});

	 		},

	 		"addOrderReceiver": function(receiver){
	 			if(debug)
	 				console.log('Adding order receiver for ' + receiver.moduleName);

	 			if(typeof receiver.moduleName === 'string' && typeof receiver.newOrder === 'function'){
	 				orderReceivers[receiver.moduleName] = receiver.newOrder;
	 			}
	 			else{
	 				var message = 'Can\'t add order receiver';
	 				if(typeof receiver.moduleName === 'string'){
	 					message += ' for module ' + receiver.moduleName;
	 				}
	 				console.log(message);
	 			}
	 			
	 		},

	 		"newOrder": function(order){
				var params = order.split(" ");
				// First word is module name
				var module = params.shift();

				// Get corresponding receiver and pass it the order
				if(typeof orderReceivers[module] === 'function'){
					orderReceivers[module](params);	
				}
				else {
					if(debug){
						console.log('Can\'t find module : ' + module);
						console.log('Parameters were :');
						console.log(params);
					}
				}
					
	 		}
	 	};

	 })();
	

	// Start Marvin
	Marvin.start(argv);

})();


