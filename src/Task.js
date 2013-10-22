define(function(require) {

	var
		Utils = require('./utils/Utils'),
		ShimWorker = require('./shim/ShimWorker'),
		Task
	;

	/* Class definition and class functions
	/* ---------------------------------------------------------------------- */
	Task = function() {
		Task.prototype._initialize.apply(this, arguments);
	};

	/* Events which are dispatched by an instance of this class. */
	Task.events = {
		MESSAGE: 'message'
	};

	/* Object functions
	/* ---------------------------------------------------------------------- */
	Utils.extend(Task.prototype, {

		/* Public API
		/* ------------------------------------------------------------------ */

		task: undefined, //typeof string

		/* This function sends given data to the worker.
		/* @param data is the data to be send. */
		run: function(data) {
			if(typeof this._worker === 'undefined') {
				this._create();
			}

			this._worker.postMessage(data);
		},

		on: function(eventName, eventHandler) {
			this._bus.on(eventName, eventHandler);
		},

		off: function(eventName, eventHandler) {
			this._bus.off(eventName, eventHandler);
		},

		/* Private functions
		/* ------------------------------------------------------------------ */

		_initialize: function(options) {
			this._options = options || {};
			this.task = this._options.task || this.task;
			this._bus = new Utils.EventBus();
		},

		_create: function() {
			if(typeof this.task !== 'string') {
				throw new Error('A Task must be provided as String.');
				return;
			}

			if(this._supportsNativeWorkers()) {
				this._createNativeWorker();
			} else {
				this._createShimWorker();
			}

			//Bind events:
			this._worker.addEventListener('message', Utils.proxy(this._onMessage, this));
		},

		_createNativeWorker: function() {
			var
				url = window.URL || window.webkitURL,
				blob = new window.Blob([this.task])
			;

			this._worker = new window.Worker(url.createObjectURL(blob));
		},

		_createShimWorker: function() {
			this._worker = new ShimWorker(this.task);
		},

		/* A feature detection for WebWorkers and other techniques to
		/* get 'inline WebWorkes' working */
		_supportsNativeWorkers: function() {
			var url = window.URL || window.webkitURL;
			return	window.Worker &&
					window.Blob &&
					typeof url === 'function' &&
					typeof url.createObjectURL === 'function';
		},

		_onMessage: function(data) {
			if(typeof this.onmessage === 'function') {
				this.onmessage(data);
			}
			this._bus.notify(Task.events.MESSAGE, data);
		}
	});

	return Task;
});
