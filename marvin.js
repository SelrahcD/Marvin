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
	 	// This is private 
	 	var orderReceivers = {};

	 	// This is public
	 	return {

	 		"start": function(argv){
	 			// Store Marvin instance
	 			var Marvin = this;

	 			console.log('Starting Marvin');
	 			// Just to have an example of optimist usage
	 			if(argv.debug){
	 				console.log('Debug Mode');
	 			}

	 			// Start all modules
	 			findit.find('../modules').on('file', function(file, stat){
	 				//If its file is start.js we need it. This should start module
					if(file.endsWith('start.js')){
						require(file).start(Marvin);
					}
				});

	 		},

	 		"addOrderReceiver": function(receiver){
	 			console.log('Adding order receiver for ' + receiver.moduleName);
	 			orderReceivers[receiver.moduleName] = receiver.newOrder;
	 		},

	 		"newOrder": function(order){
				var params = order.split(" ");
				// First word is module name
				var module = params.shift();

				// Get corresponding receiver and pass it the order
				if(typeof orderReceivers[module] === 'function'){
					orderReceivers[module](params);	
				}
					
	 		}
	 	};

	 })();
	

	// Start Marvin
	Marvin.start(argv);

})();


