/* global asyncTest, start, equal */
;(function(window, require) {

	require.config({
		paths: {
			text: '../../libs/requirejs/requirejstext'
		}
	});

	require(
		[
			'../../src/Task',
			'text!worker.js'
		],
		function(Task, Worker) {
			var
				task = new Task({
					task: Worker
				}),
				supports = task._supportsNativeWorkers(),
				supportsText = supports ? 'Web Worker' : 'Shim Worker'
			;

			window.document.getElementById('type').innerHTML = supportsText;

			asyncTest('worker result', 1, function() {
				task.on('message', onMessage);
				task.run({a: 1,	b: 1});

				function onMessage(event) {
					start();
					equal(event.data, 2);
					window.document.getElementById('output').innerHTML = event.data;
				}
			});
		}
	);

})(window, require);
