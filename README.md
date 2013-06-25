@description Class

A class based OO inheritance pattern implementation in Javascript.
Exports a module which works in AMD, NodeJS and CommonJS

Useage
======

Pass an object in with the functions you want all instances of the class to start with.
Modify the class variable to add functions.

Define a class (type):

	  var Vehicle = Objects.Class({});


Instanciation:

	var v = new Vehicle();


Define a class with a constructor:

	var Vehicle = Objects.Class({
		init: function(manufacturer) {
			this.manufacturer = manufacturer;
		}
	});


Instanciate a class with a constructor:

	var v = new Vehicle('Big Cars Incorporated');


Define a subclass:

	var Car = Objects.Class(Vehicle, {});


Define a subclass with a constructor

__super can be positioned anywhere in the arguments list.

	var Car = Objects.Class(Vehicle, {
		init: function(manufacturer, model) {
			this.model = model;
		}
	});


Define a subclass with a constructor, calling the overridden function

 __super here is a reference to the Vehicle.init() function. It can appear anywhere in the arguments list.
  
 Change '__super' to be a different variable name in modules.settings.superclassInjector

	  var Car = Objects.Class(Vehicle, {
		  init: function(__super, manufacturer, model) {
			  this.model = model;

			  // call the superclass constructor, passing in the parameter.
			  __super.init(manufacturer);
		  }
	  });


  Inheritance + mixins:

	  var Trailer = Objects.Class(Vehicle, Car, {});

