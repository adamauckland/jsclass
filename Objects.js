/*
 *
 *  The difference between programming and scripting
 *
 *  one requires a level of understanding of the language, the other simply an understanding of the syntax
 *
 *  When a programmer says 'I can program in any language' they are still a scripter. They do
 *  not comprehend the nuances which make them a programmer.
 *
 */










"use strict";


var Class = (function() {



	/**
	 * @description Settings
	 */
	var settings = {
		/**
		 * @description	What to use as a superclass injector in any overriding functions
		 */
		superclassInjector: '$super'
	};


	/**
	 * @description Copy the attributes from one object to another
	 * @param		destination	Object to copy parameters to
	 * @param		source		Object to copy parameters from
	 */
	function extend(destination, source) {
		for (var loopItem in source) {
			console.log('Copying ' + loopItem);
			destination[loopItem] = source[loopItem];
		}
	}


	/**
	 * @description Check to see if an object is a function
	 * @param		testObject	Object
	 * @returns		false or true
	 */
	function isFunction(testObject) {
	  return Object.prototype.toString.call(testObject) === '[object Function]';
	}


	/**
	 * @description Examine code for a superclass injector, defined in
	 * settings.superclassInjector
	 *
	 * @returns -1 if no superclass injector
	 * 			or the index the injector is in the arguments array
	 */
	function hasSuperArgument(itemObject) {
		var hasSuper = -1,
			args,
			argIndex;

		args = /\(([^)]+)/.exec(itemObject.toString());

		if (args === null) {
			return -1;
		}

		if (args[1]) {
			args = args[1].split(/\s*,\s*/);
		}

		for (argIndex = 0; argIndex < args.length; argIndex++) {
			if (args[argIndex] === settings.superclassInjector) {
				hasSuper = argIndex;
			}
		}

		return hasSuper;
	}


	function subclass() {

	}


	function Mixin(opts) {
		var superclassPrototype;

		if((typeof this.__superclass !== 'undefined') &&
		   (typeof this.__superclass.prototype !== 'undefined')){
			superclassPrototype = this.__superclass.prototype;
		}

		/**
		 * If we've got some functions in the opts, look for overrides.
		 *
		 * The user can use $super to access the superclass methods
		 */
		if (typeof opts !== 'undefined') {
			for(var itemName in opts){
				var itemObject = opts[itemName],
				superArgumentIndex = -1;

				console.log(itemObject);

				/**
				 * If we reference a parameter called $super,
				 * point it to the superclass
				 */
				if (
					(superclassPrototype) &&
					(isFunction(itemObject) === true)) {

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

						itemObject = (function(input) {
							return function() {
								var $scope,
									argumentList = [],
									i, outerScope = this;

								// set $scope to be a reference to a function which calls
								// the superclassed function WITHIN OUR SCOPE
								$scope = function() {
									superclassPrototype[input].apply(outerScope, arguments);
								};

								// create a new arguments list
								argumentList.push($scope);
								for (i=0; i < arguments.length; i++) {
									argumentList.push(arguments[i])
								}

								// now execute the original code, passing in the argument list with $super added on
								// $super is a reference to the same name function in the superclass
								tempCode.apply(this, argumentList);
							}
						})(itemName);
					}
				}

				this.prototype[itemName] = itemObject;
			}
		}

		// not sure about this
		return this;
	}


	/**
	 * @description Create a new class with inheritance.
	 *
	 * @param superclass optional. A class to inherit from
	 * @param opts optional. An object to initialise the class
	 */
	function Create(superclass, opts) {
		var argumentsIndex,
			argumentsItem,
			argumentsName,
			code,
			args,
			hasSuper;

		/**
		 * Create a factory function for this class.
		 */
		function factory() {
			this.init.apply(this, arguments);
		};


		/**
		 * Import basic functionality
		 */
		extend(factory, {
			Mixin: Mixin
		});


		factory.subclasses = [];
		for (argumentsIndex = 0; argumentsIndex < arguments.length; argumentsIndex++) {
			extend(factory.prototype, arguments[argumentsIndex]);
		}


		/**
		 * If we have a superclass, create a new prototype, the same as the
		 * superclass prototype and reference that
		 */
		if (arguments.length > 0) {
			if (isFunction(superclass)) {
				factory.__superclass = superclass;

				subclass.prototype = superclass.prototype;
				factory.prototype = new subclass;
				superclass.subclasses.push(factory);
			}
		}


		/**
		 * Import the opts functions, overiding where necessary
		 */
		factory.Mixin(opts);


		/**
		 * Add a blank prototype if it doesn't exist
		 */
		if (typeof factory.prototype.init === 'undefined') {
			factory.prototype.init = function() {

			};
		}

		/**
		 * Reset constructor
		 */
		factory.prototype.constructor = factory;

		return factory;
	}

	return {
		Create: Create,
	};
})();









// tests
console.log('Declare cusotmer');
var Customer = Class.Create({
	init: function(name ) {
		this.name = name;
		console.log('setting name');
	}
});

console.log('Instanciate customer');
var c = new Customer('customer');

console.log('Declare debt');
var Debt = Class.Create(Customer, {
	init: function($super, name, age) {
		this.age = age;
		$super(name);
	}, getAge: function() {
		return this.age;
	}
});

console.log('Instanciate debt');
var d = new Debt('a', 30);
console.log('The name is ' + d.name);
console.log('The age is  ' + d.age);

console.log('d is instance of Debt');
console.log(d instanceof Debt);

console.log('c is instance of Debt');
console.log(c instanceof Debt);

console.log('Execute getAge');
console.log(d.getAge());

console.log('Add a function to Debt');
Debt.Mixin(
	{'showAge': function() {
		return this.age;
	}
});

console.log('Run that code');
console.log(' the new age is ' + d.showAge());