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
				task = new Task(),
				supports = task._supportsNativeWorkers(),
				supportsText = supports ? 'Web Worker' : 'Shim Worker'
			;

			function onMessage(event) {
				window.document.getElementById('output').innerHTML = event.data;
			}

			task.task = Worker;
			task.on('message', onMessage);
			task.run({a: 1,	b: 1});

			window.document
				.getElementById('type')
				.innerHTML = 'Uses: '+ supportsText;
		}
	);

})(window, require);
