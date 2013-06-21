require.config({
    urlArgs: "bust=" + (new Date()).getTime()
});


require(
	['./Tests'],
	
	function(Tests) {
		// run the tests
		window.test = Tests;
	}
);