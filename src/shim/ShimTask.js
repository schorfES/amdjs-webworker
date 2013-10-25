define(function(require) {

	var
		Utils = require('./../utils/Utils'),
		ShimTask = function() {
			ShimTask.prototype._initialize.apply(this, arguments);
		},
		shimTaskIdCount = 0,
		NAMESPACE_WORKER = 'shimworker',
		NAMESPACE_TASK = 'shimtask'
	;

	ShimTask.getNewId = function() {
		shimTaskIdCount++;
		return shimTaskIdCount;
	};

	Utils.extend(ShimTask.prototype, {

		/* Public API
		/* ------------------------------------------------------------------ */

		postMessage: function(data) {
			this._bus.notify('message:' + NAMESPACE_TASK,
				{
					data: data,
					type: 'message',
					timeStamp: (new window.Date()).getTime()
				}
			);
		},

		addEventListener: function(eventName, eventHandler) {
			this._bus.on(eventName + ':' + NAMESPACE_WORKER, eventHandler);
		},

		/* Private functions
		/* ------------------------------------------------------------------ */

		_initialize: function(bus, source) {
			this._id = ShimTask.getNewId();
			this._bus = bus;
			this._source = source;

			this._createWorker();
			this._runWorker();
		},

		_createWorker: function() {
			var
				targetTag = window.document.body || window.document.getElementsByTagName('body')[0],
				scriptTag = window.document.createElement('script'),
				scriptText = this._getFunctionSource(),
				scriptTextNode = window.document.createTextNode(scriptText)
			;

			//Find correct target:
			if (!targetTag) {
				targetTag = window.document.getElementsByTagName('head')[0] || window.document.documentElement;
				if (!targetTag) {
					throw new Error('There is no <head> or <body> inside the DOM.');
				}
			}

			//Build
			targetTag.appendChild(scriptTag);
			scriptTag.id = this._getFunctionName();
			scriptTag.type = 'text/javascript';

			try {
				scriptTag.appendChild(scriptTextNode);
			} catch(error) {
				//IE uses this case to inject text into a script tag:
				scriptTag.text = scriptText;
			}
		},

		_runWorker: function() {
			//This is where the magic happens: The created function in the
			//global namespace should be is executed in the scope of the
			//instance of this class:
			window[this._getFunctionName()].call(this);
		},

		_getFunctionName: function() {
			return NAMESPACE_TASK + this._id.toString();
		},

		_getFunctionSource: function() {
			//Generate a function of the webworker source code in the global
			//namespace. Overwrite the local variables of this function for the
			//current context of this task (see _runWorker()):
			return 'window.' + this._getFunctionName() + ' = function() {' +
						'var self = this; ' +
						this._source +
					'};';
		}

	});

	return ShimTask;

});
