define(function(require) {

	var
		Utils = require('./../utils/Utils'),
		ShimTask = require('./ShimTask'),
		ShimWorker = function() {
			ShimWorker.prototype._initialize.apply(this, arguments);
		},
		NAMESPACE_WORKER = 'shimworker',
		NAMESPACE_TASK = 'shimtask'
	;

	Utils.extend(ShimWorker.prototype, {

		/* Public API
		/* ------------------------------------------------------------------ */

		postMessage: function(data) {
			this._bus.notify('message:' + NAMESPACE_WORKER, {data: data});
		},

		addEventListener: function(eventName, eventHandler) {
			this._bus.on(eventName + ':' + NAMESPACE_TASK, eventHandler);
		},

		/* Private functions
		/* ------------------------------------------------------------------ */

		_initialize: function(source) {
			this._source = source;
			this._bus = new Utils.EventBus();
			this._task = new ShimTask(this._bus, source);
		}

	});

	return ShimWorker;

});
