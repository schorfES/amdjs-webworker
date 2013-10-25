define(function() {

	var
		EventBus = function() {
			this._events = {};
		}
	;

	EventBus.prototype.on = function(eventName, eventHandler) {
		if (!this._events[eventName]) {
			this._events[eventName] = [];
		}

		this._events[eventName].push(eventHandler);
	};

	EventBus.prototype.off = function(eventName, eventHandler) {
		var index;

		if (typeof this._events[eventName] === 'object') {
			if (typeof eventHandler === 'function') {
				//Remove specific eventHandler
				for (index = 0; index < this._events[eventName].length; index++) {
					if (this._events[eventName][index] === eventHandler) {
						this._events[eventName].splice(index, 1);
					}
				}
			} else {
				//Remove all eventHandlers
				this._events[eventName] = undefined;
				delete(this._events[eventName]);
			}
		}
	};

	EventBus.prototype.notify = function(eventName, eventData) {
		var index;

		if (typeof this._events[eventName] === 'object') {
			for (index = 0; index < this._events[eventName].length; index++) {
				this._events[eventName][index](eventData);
			}
		}
	};

	return {

		EventBus: EventBus,

		/* This clones all properties of given objects into the first object.
		/* (A small version of $.extend) */
		extend: function() {
			var
				target = window.Array.prototype.shift.call(arguments),
				source, key
			;

			if (typeof target === 'object' && arguments.length > 0) {
				while (arguments.length > 0) {
					source = window.Array.prototype.shift.call(arguments);
					if (source) {
						for (key in source) {
							target[key] = source[key];
						}
					}
				}
			}

			return target;
		},

		proxy: function(method, scope) {
			return function() {
				if (typeof method === 'function') {
					method.apply(scope, arguments);
				}
			};
		}

	};
});
