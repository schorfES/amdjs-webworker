/* global self */
self.addEventListener('message', function(event) {
	var
		a = event.data.a,
		b = event.data.b
	;

	self.postMessage(a + b);
});
