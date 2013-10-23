#AMDJS Web Worker

A cross browser AMD module to run Web Workers.

This approach allows you to build your projects including Web Worker tasks with
tools like RequireJS Optimizer into a single file. It also ships a shim for
browsers which did't support the Web Worker API.

## Usage

An instance of the ```Task```class acts as mediator between your app and your
Web Worker. It also handles the feature detection of your browser and runs if
necessary in a "fallback" mode.

The instance requires a ```task``` property with type of ```string```. This
makes your Web Worker bundable with tools like the RequireJS Optimizer. When
using RequireJS add the Text Plugin into your project to require your
Web Worker like a _regular_ AMD module.

```javascript
//SomeModule.js
define(function(require)) {
	var
		Task = require('Task'),
		Worker = require('text!Worker.js'),
		myTask
	;

	myTask = new Task({
		task: Worker
	});
	myTask.run();
});
```

## Documentation

The ```Task``` instance offers the following properties and functions:

### ```.task```

This property is required. It provides the source of the Web Worker to the task.
It can be provided to the task as a property of the constructor parameter or
after the instantiation through the ```.task```property. It's **important** to
set this property before you call the ```.run()```function.

#### Example:

```javascript
var
	Worker = '/*... some web worker code */',
	myTask = new Task({task: Worker}) //The one way...
;
myTask.task = Worker; //The other way...
```

### ```.run(data)```

This function runs the Web Worker. The ```data``` param will be send to
the Worker.

### ```.on(eventName, eventHandler)```

Adds an ```eventHandler``` function to the instance for the given
```eventName```. The instance fires the following events:

* ```message```: fired when Web Worker calls ```postMessage```.

### ```.off(eventName, eventHandler)```

Removes the previously added ```eventHandler``` from the given ```eventName```.
When only ```eventName``` is given, all previously added ```eventHandler```'s are
removed.

## License

[LICENSE (MIT)](LICENSE)
