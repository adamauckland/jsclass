/**
 * @description Class
 *
 * A class based OO inheritance pattern implementation in Javascript.
 * Exports a module which works in AMD, NodeJS and CommonJS
 *
 * Useage
 * ======
 *
 * Pass an object in with the functions you want all instances of the class to start with.
 * Modify the class variable to add functions.
 *
 * Define a class (type):
 *
 * 		var Vehicle = Objects.Class({});
 *
 *
 * 	Instanciation:
 *
 * 		var v = new Vehicle();
 *
 *
 * 	Define a class with a constructor:
 *
 *		var Vehicle = Objects.Class({
 *			init: function(manufacturer) {
 *				this.manufacturer = manufacturer;
 *			}
 *		});
 *
 *
 *	Instanciate a class with a constructor:
 *
 *		var v = new Vehicle('Big Cars Incorporated');
 *
 *
 *	Define a subclass:
 *
 *		var Car = Objects.Class(Vehicle, {});
 *
 *
 *	Define a subclass with a constructor, calling the overridden superclass constructor:
 *	Note:  __super here is a reference to the Vehicle.init() function.
 *	Change __super to be something different in the modules.settings.superclassInjector.
 *
 *	__super can be positioned anywhere in the arguments list.
 *
 *		var Car = Objects.Class(Vehicle, {
 *			init: function(__super, manufacturer, model) {
 *				this.model = model;
 *
 *				// call the superclass constructor, passing in the parameter.
 *				__super.init(manufacturer);
 *			}
 *		});
 *
 *
 * 	Mixins:
 *
 * 		var Trailer = Objects.Class(Vehicle, Car, {});
 *
 */
(function (root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else if (typeof define === 'function' && define.amd) {
		define(factory);
	} else {
		root.returnExports = factory();
	}
}(this, function () {
	"use strict";
	/**
	 * @description Settings for module. Not generally user modified
	 */
	var settings = {
		/**
		 * @description	What to use as a superclass injector in any overriding functions
		 */
		superclassInjector: '__super'
	};
	

	/**
	 * @description Copy the attributes from one object to another
	 * @param		destination	Object to copy parameters to
	 * @param		source		Object to copy parameters from
	 */
	function extend(destination, source) {
		for (var loopItem in source) {
			destination[loopItem] = source[loopItem];
		}
	}


	/**
	 * @description Check to see if an object is a function
	 * @param		test Object	Object
	 * @returns		false or true
	 */
	function isFunction(testObject) {
		return Object.prototype.toString.call(testObject) === '[object Function]';
	}


	/**
	 * @description Examine code for a superclass injector, defined in
	 * 				settings.superclassInjector
	 *
	 * @returns -1 	if no superclass injector
	 * 				or the index the injector is in the arguments array
	 */
	function hasSuperArgument(itemObject) {
		var hasSuper = -1,
			args,
			argIndex;

		// parse the code and look for the parameters
		args = /\(([^)]+)/.exec(itemObject.toString());

		if (args === null) {
			return -1;
		}

		if (args[1]) {
			args = args[1].split(/\s*,\s*/);
		}

		// look for the superclassInjector item
		for (argIndex = 0; argIndex < args.length; argIndex++) {
			if (args[argIndex] === settings.superclassInjector) {
				hasSuper = argIndex;
			}
		}

		return hasSuper;
	}


	/**
	 * @description Temporary object so we can chain prototypes
	 */
	function subclass() {

	}


	/**
	 * @description Extend this class with the opts object, checking for
	 * 				overrides
	 * @param		opts	an object of default functions or parameters
	 */
	function Extend(opts) {
		if (typeof opts === 'undefined') {
			return;
		}
		
		var superclassPrototype,
			superArgumentIndex,
			itemObject,
			itemName;

		if((typeof this.__superclass !== 'undefined') &&
		   (typeof this.__superclass.prototype !== 'undefined')){
			superclassPrototype = this.__superclass.prototype;
		}

		//
		// If we've got some functions in the opts, look for overrides.
		//
		// look for configurable superclass parameter and inject a reference to the
		// overridden function in place.
		//
		for(itemName in opts){
			itemObject = opts[itemName],
			superArgumentIndex = -1;

			// check to see if we are overriding a superclass function
			if ((superclassPrototype) && (isFunction(itemObject) === true)) {
				superArgumentIndex = hasSuperArgument(itemObject);

				if ((typeof superArgumentIndex !== 'undefined') && (superArgumentIndex !== -1)) {

					// attach this function as an anonymous function, passing in the superclass
					// instead of $super

					// create a function to repalce the other one
					// $scope should be a reference to a function which calls the function
					// on the ancestor with the name of this property, within our scope

					// we want to return a function which calls the function being passed in,
					// with the $scope parameter as a function to run the method on the ancestor
					// function

					var tempCode = itemObject;

					itemObject = (function(input, superArgumentIndex) {
						return function() {
							var superClassFunction,
								argumentList,
								outerScope = this;

							// create a reference to run the function from the superclass WITHIN OUR SCOPE
							superClassFunction = function() {
								superclassPrototype[input].apply(outerScope, arguments);
							};

							// Dependency inject the reference
							argumentList = Array.prototype.slice.call(arguments);
							argumentList.splice(superArgumentIndex, 0, superClassFunction);

							// now execute the original code, passing in the argument list with
							// the superclass method injected in
							tempCode.apply(this, argumentList);
						}
					})(itemName, superArgumentIndex);
				}
			}

			this.prototype[itemName] = itemObject;
		}
	}


	/**
	 * @description Define a new class with optional inheritance.
	 *
	 * @param 		superclass 	optional. A class to inherit from
	 * @param 		opts 		optional. An object to initialise the class
	 *
	 * 				You can mixin as many objects as you want, but the first one
	 * 				will always become the superclass
	 */
	function Class(superclass, opts) {
		var argumentsIndex,
			argumentsItem,
			argumentsName,
			code,
			args,
			hasSuper;

		//
		// Create a factory function for this class.
		//
		function factory() {
			this.init.apply(this, arguments);
		};


		// ensure every class has an Extend method
		extend(factory, {
			Extend: Extend
		});


		// support as many mixins as are passed in
		factory.subclasses = [];
		for (argumentsIndex = 0; argumentsIndex < arguments.length; argumentsIndex++) {
			// lowerclass extend simply copies the values without supporting superclass.init() calls
			extend(factory.prototype, arguments[argumentsIndex]);
		}


		//
		// If we have a superclass, create a new prototype, the same as the
		// superclass prototype and reference that
		//
		if (arguments.length > 0) {
			if (isFunction(superclass)) {
				// we need to use the superclass when overriding methods
				factory.__superclass = superclass;

				// use a new prototype object
				subclass.prototype = superclass.prototype;
				factory.prototype = new subclass;
				
				// give the superclass a reference back to us
				superclass.subclasses.push(factory);
			}
		}
		
		
		//
		// Import the opts functions, overiding where necessary
		//
		factory.Extend(opts);
		
		
		//
		// If we are implementing an interface, use the interface init to check
		//
		if(typeof BaseInterface !== 'undefined') {
			if(superclass === BaseInterface) {
				EnforceInterface(factory);
			}	
		}

		
		//
		// Add a blank prototype if it doesn't exist
		//
		if (typeof factory.prototype.init === 'undefined') {
			factory.prototype.init = function() {

			};
		}
		
		
		//
		// Reset constructor
		//
		factory.prototype.constructor = factory;

		return factory;
	}
	
	
	/**
	 * @description This is the module which gets exported
	 */
	return {
		Class: Class
	}
}));

