# ag-logger

An AngularJS logger with configurable log levels. All logging messages are delegated to Angular's [$log](https://docs.angularjs.org/api/ng/service/$log) service.

* [Demo](https://github.io/giannico/ag-logger)
* [Getting Started](#getting-started)
* [API Documentation](#api-documentation)
* [Changes](https://github.com/giannico/ag-logger/tree/master/CHANGELOG.md)
* [License](https://github.com/giannico/ag-logger/tree/master/LICENSE)

## Getting Started

We use bower for dependency management. Install `ag-logger` into your project by running:

```sh
$ bower install ag-logger
```

After installing `ag-logger`, load the script file in your application:

```html
<script type="text/javascript" src="bower_components/ag-logger/release/ag-logger.js"></script>
```

Then, add the `ag-logger` module as a dependency to your application:

```js
var appModule = angular.module('app', ['ag-logger']);
```


## Usage

### Levels

There are five logging levels available:

**ERROR > WARN > INFO > LOG > DEBUG**

When a logger is set to a particular level, it will only log messages at that are logged at a level greater than or equal to the level it's configured at. For instance, if the logger is set to `WARN` level, it will log `ERROR` and `WARN` messages. If the logger is set to `ERROR` level, it will only log `ERROR` messages.

Logging can be configured as a provider or a service (or a combination of both).

### Provider [agLoggerProvider](#provider-agloggerprovider-1)

```js
angular.module('app', ['ag-logger']).
    config(function(agLoggerProvider) {
        // sets the logger to ERROR level logging, during app configuration
        agLoggerProvider.setLogLevel(agLoggerProvider.LOG_LEVELS.ERROR);
    });
```

### Service [agLogger](#service-aglogger-1)

```js
angular.module('app', ['ag-logger']).
    controller('AppCtrl', AppCtrl);

function AppCtrl(agLogger) {
    initLogging();
    
    function initLogging() {
        // sets the logger to WARNING level logging, within the application code
        agLogger.setLogLevel(agLogger.LOG_LEVELS.WARN);
    }
}
```

### Logging Messages

Messages can be logged via the [agLogger](#service-aglogger-1) service.

**Note:** By default, all logging levels are enabled.

```js
angular.module('app', ['ag-logger']).
    controller('AppCtrl', AppCtrl);

function AppCtrl(agLogger) {
    testLogging();
    
    function testLogging() {
        // sets the logger to WARNING level logging, within the application code
        logger.setLogLevel(logger.LOG_LEVELS.WARN);
        logger.error('Error message');  // will be displayed in the console.
        logger.warn('Warning message'); // will be displayed in the console.
        logger.info('Info message');    // will not be displayed in the console.
        logger.log('Log message');      // will not be displayed in the console.
        logger.debug('Debug message');  // will not be displayed in the console.
    }
}
```


## API Documentation

**Note:** By default, all logging levels are enabled.

### Provider `agLoggerProvider`

* property LOG_LEVELS - `[string]`

  Returns a dictionary of all supported logging levels.

```js
function configFn(agLoggerProvider) {
    var LOG_LEVELS = agLoggerProvider.LOG_LEVELS;

    console.log(LOG_LEVELS.OFF);   // off
    console.log(LOG_LEVELS.ERROR); // error
    console.log(LOG_LEVELS.WARN);  // warn
    console.log(LOG_LEVELS.INFO);  // info
    console.log(LOG_LEVELS.LOG);   // log
    console.log(LOG_LEVELS.DEBUG); // debug
    console.log(LOG_LEVELS.ALL);   // all
}
```

  **Note:** `LOG_LEVELS.OFF` and `LOG_LEVELS.ALL` don't have corresponding log functions, they're just filter levels.

* `void` setLogLevel(logLevelName)

  Sets the log level.

```js
function configFn(agLoggerProvider) {
    // these two statements are functionally equivalent
    agLoggerProvider.setLogLevel(agLoggerProvider.LOG_LEVELS.WARN);
    agLoggerProvider.setLogLevel('warn');
}
```

* `string` getLogLevel()

  Gets the current log level.

* `void` enableAll()

  Enables the logging of all messages.

```js
function configFn(agLoggerProvider) {
    // these three statements are functionally equivalent
    agLoggerProvider.setLogLevel(agLoggerProvider.LOG_LEVELS.ALL);
    agLoggerProvider.setLogLevel('all');
    agLoggerProvider.enableAll();
}
```

* `void` disableAll()

  Disables the logging of all messages.

```js
function configFn(agLoggerProvider) {
    // these three statements are functionally equivalent
    agLoggerProvider.setLogLevel(agLoggerProvider.LOG_LEVELS.OFF);
    agLoggerProvider.setLogLevel('off');
    agLoggerProvider.disableAll();
}
```


### Service `agLogger`

* property LOG_LEVELS - `[string]`

  Returns a dictionary of all supported logging levels.

```js
function AppCtrl(agLogger) {
    var LOG_LEVELS = agLogger.LOG_LEVELS;

    console.log(LOG_LEVELS.OFF);   // off
    console.log(LOG_LEVELS.ERROR); // error
    console.log(LOG_LEVELS.WARN);  // warn
    console.log(LOG_LEVELS.INFO);  // info
    console.log(LOG_LEVELS.LOG);   // log
    console.log(LOG_LEVELS.DEBUG); // debug
    console.log(LOG_LEVELS.ALL);   // all    
}
```

* `void` setLogLevel(logLevelName)

  Sets the log level.

```js
function AppCtrl(agLogger) {
    // these two statements are functionally equivalent
    agLogger.setLogLevel(agLogger.LOG_LEVELS.WARN);
    agLogger.setLogLevel('warn');
}
```

* `string` getLogLevel()

  Gets the current log level.

* `void` enableAll()

  Enables the printing of all log levels.

```js
function config(agLogger) {
    // these three statements are functionally equivalent
    agLogger.setLogLevel(agLogger.LOG_LEVELS.ALL);
    agLogger.setLogLevel('all');
    agLogger.enableAll();
}
```

* `void` disableAll()

  Disables the printing of all log levels.

```js
function config(agLogger) {
    // these three statements are functionally equivalent
    agLogger.setLogLevel(agLogger.LOG_LEVELS.OFF);
    agLogger.setLogLevel('off');
    agLogger.disableAll();
}
```

* `boolean` willLog(logLevel)

  Returns a boolean representing whether the logger will log (print) messages at the provided level (depending on what the logger's current level is set at).

#### Logging functions

Messages will only be logged if they are logged at a level equal to or greater than the logger's configured level (see [Usage](#usage)).

* `void` error(message)

  Logs the provided message at the `error` level.

* `void` warn(message)

  Logs the provided message at the `warn` level.

* `void` info(message)

  Logs the provided message at the `info` level.

* `void` log(message)

  Logs the provided message at the `log` level.

* `void` debug(message)

  Logs the provided message at the `debug` level.
