jsclass
=======

Class-based OO pattern for JavaScript


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


Define a subclass with a constructor, calling the overridden superclass constructor:
Note:  __super here is a reference to the Vehicle.init() function.
Change __super to be something different in the modules.settings.superclassInjector.

__super can be positioned anywhere in the arguments list.

	var Car = Objects.Class(Vehicle, {
		init: function(__super, manufacturer, model) {
			this.model = model;

			// call the superclass constructor, passing in the parameter.
			__super.init(manufacturer);
		}
	});


Mixins:

	var Trailer = Objects.Class(Vehicle, Car, {});

