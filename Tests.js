
define(["./Objects"], function(Objects) {
	
	var module = {
		main: function() {
			
			function Assert(func, value) {
				var v = func.call(window);
				console.log('ASSERT:'.concat(v===value));
			}
			
			
			// test interface
			//console.log('Create test interface');
			//var TestInterface = Objects.Interface({
			//	'getAll': function(search) { },
			//	'getById': function(id) { }
			//});
			//
			//console.log('Create a test class to implement the interface');
			//var c = Objects.Class(TestInterface, {});
			// should throw exception
			
			
			// tests
			console.log('Declare a customer class');
			
			var Customer = Objects.Class({
				init: function(name ) {
					this.name = name;
				}
			});
			
			console.log('Instanciate new customer instance');
			var c = new Customer('customer');
			
			console.log('Customer name is ');
			console.log(c.name);
			
			
			console.log('Declare debter class');
			var Debter = Objects.Class(Customer, {
				init: function(name, __super, age) {
					this.age = age;
					__super(name);
				}, getAge: function() {
					return this.age;
				}
			});
			
			console.log('Instanciate debter instance');
			var d = new Debter('a', 30);
			console.log('The name is '.concat(d.name));
			console.log('The age is  '.concat(d.age));
			
			console.log('d is instance of Debter');
			console.log(d instanceof Debter);
			
			console.log('c is instance of Debter');
			console.log(c instanceof Debter);
			
			console.log('Execute getAge');
			console.log(d.getAge());
			
			console.log('Add a function to Debter class');
			Debter.Extend(
				{'showAge': function() {
					return this.age;
				}
			});
			
			Assert(function() { return d.showAge(); }, 30);
			
			console.log('Run that code');
			console.log(' the new age is '.concat(d.showAge()));
		}
	}
	
	return module.main;
});
