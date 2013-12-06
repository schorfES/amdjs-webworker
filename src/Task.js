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
		useShimWorker: false, //for debugging purposes

		/* This function sends given data to the worker.
		/* @param data is the data to be send. */
		run: function(data) {
			if (typeof this._worker === 'undefined') {
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
			this.useShimWorker = this._options.useShimWorker || this.useShimWorker;
			this._bus = new Utils.EventBus();
		},

		_create: function() {
			if (typeof this.task !== 'string') {
				throw new Error('A Task must be provided as String.');
			}

			if (this._supportsNativeWorkers()) {
				this._createNativeWorker();
			} else {
				this._createShimWorker();
			}

			//Bind events:
			this._worker.addEventListener('message', Utils.proxy(this._onMessage, this));
		},

		_createNativeWorker: function() {
			try {
				var
					url = this._getUrlObject(),
					BlobClass = this._getBlobClass(),
					WorkerClass = this._getWorkerClass(),
					blob
				;

				blob = new BlobClass([this.task], {type: 'text/javascript'});
				this._worker = new WorkerClass(url.createObjectURL(blob));
			} catch(error) {
				this._createNativeWorkerByBlobbuilder();
			}
		},

		_createNativeWorkerByBlobbuilder: function() {
			try {
				var
					url = this._getUrlObject(),
					BlobBuilderClass = this._getBlobBuilderClass(),
					blobBuilder = new BlobBuilderClass(),
					blob
				;

				blobBuilder.append(this.task);
				blob = blobBuilder.getBlob();
				this._worker = new window.Worker(url.createObjectURL(blob));
			} catch(error) {
				this._createShimWorker();
			}
		},

		_createShimWorker: function() {
			this._worker = new ShimWorker(this.task);
		},

		/* A feature detection for WebWorkers and other techniques to
		/* get 'inline WebWorkes' working */
		_supportsNativeWorkers: function() {
			var
				url = this._getUrlObject(),
				workerClass = this._getWorkerClass(),
				blobClass = this._getBlobClass(),
				blobBuilderClass = this._getBlobBuilderClass()
			;

			return	!this.useShimWorker &&
					workerClass &&
					(blobClass || blobBuilderClass) &&
					(typeof url === 'function' || typeof url === 'object') &&
					typeof url.createObjectURL === 'function';
		},

		_usesNativeWorkers: function() {
			return this._worker !== undefined && !(this._worker instanceof ShimWorker);
		},

		_getWorkerClass: function() {
			return window.Worker;
		},

		_getUrlObject: function() {
			return window.webkitURL || window.URL;
		},

		_getBlobClass: function() {
			return window.Blob;
		},

		_getBlobBuilderClass: function() {
			return	window.WebKitBlobBuilder ||
					window.MozBlobBuilder ||
					window.MSBlobBuilder ||
					window.BlobBuilder;
		},

		_onMessage: function(data) {
			if (typeof this.onmessage === 'function') {
				this.onmessage(data);
			}
			this._bus.notify(Task.events.MESSAGE, data);
		}
	});

	return Task;
});
