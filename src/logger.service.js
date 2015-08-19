(function() { 'use strict';

    angular.module('agLogger').
        provider('agLogger', agLoggerProvider);

    ////////////////////

    var _LOG_LEVELS = {
        OFF:   { name: 'off',   value: 6 },
        ERROR: { name: 'error', value: 5, logLabel: 'ERR ' },
        WARN:  { name: 'warn',  value: 4, logLabel: 'WARN  '},
        INFO:  { name: 'info',  value: 3, logLabel: 'INFO ' },
        LOG:   { name: 'log',   value: 2, logLabel: 'LOG ' },
        DEBUG: { name: 'debug', value: 1, logLabel: 'DEBUG ' },
        ALL:   { name: 'all',   value: 0 }
    };

    var LOG_LEVEL_NAMES = {
        OFF:   _LOG_LEVELS.OFF.name,
        ERROR: _LOG_LEVELS.ERROR.name,
        WARN:  _LOG_LEVELS.WARN.name,
        INFO:  _LOG_LEVELS.INFO.name,
        LOG:   _LOG_LEVELS.LOG.name,
        DEBUG: _LOG_LEVELS.DEBUG.name,
        ALL:   _LOG_LEVELS.ALL.name
    };

    ////////////////////

    function agLoggerProvider() {

        // Enable logging of all levels by default
        var _initializedLogLevel = _LOG_LEVELS.ALL;

        ////////////////////
        /// Provider API
        ////////////////////
        var provider = {};

        provider.LOG_LEVELS = LOG_LEVEL_NAMES;

        provider.enableAll = function() { _initializedLogLevel = _LOG_LEVELS.ALL; };

        provider.disableAll = function() { _initializedLogLevel = _LOG_LEVELS.OFF; };

        provider.setLogLevel = function(logLevelName) { _initializedLogLevel = getLogLevelObj(logLevelName); };

        provider.getLogLevel = function() { return _initializedLogLevel.name; };

        provider.$get = $get;
        provider.$get.$inject = ['$log'];

        return provider;

        ////////////////////

        ////////////////////
        /// Service API
        ////////////////////

        function $get($log) {
            var _currentLogLevel = null;

            var service = {};

            service.LOG_LEVELS = LOG_LEVEL_NAMES;
            service.enableAll = enableAll;
            service.disableAll = disableAll;
            service.setLogLevel = setLogLevel;
            service.getLogLevel = getLogLevel;
            service.willLog = willLog;

            service.setLogLevel(_initializedLogLevel.name);

            return service;

            ////////////////////

            function getLogLevel() { return _initializedLogLevel.name; }

            function enableAll() { service.setLogLevel(_LOG_LEVELS.ALL.name); }

            function disableAll() { service.setLogLevel(_LOG_LEVELS.OFF.name); }

            function willLog(logLevelName) {
                var logLevelObj = getLogLevelObj(logLevelName);

                return logLevelObj.value >= _currentLogLevel.value;
            }

            function setLogLevel(logLevelName) {
                _currentLogLevel = getLogLevelObj(logLevelName);
                _refreshLogFns();
            }

            ////////////////////

            function _refreshLogFns() {
                service.error = _getLogFn($log.error, _LOG_LEVELS.ERROR);
                service.warn  = _getLogFn($log.warn,  _LOG_LEVELS.WARN);
                service.info  = _getLogFn($log.info,  _LOG_LEVELS.INFO);
                service.log   = _getLogFn($log.log,   _LOG_LEVELS.LOG);
                service.debug = _getLogFn($log.debug, _LOG_LEVELS.DEBUG);
            }

            function _getLogFn(logFn, logLevelObj) {
                if (!service.willLog(logLevelObj.name)) { return angular.noop; }

                return function() {
                    var args = Array.prototype.slice.call(arguments);

                    if(angular.isString(args[0])) {
                        args[0] = logLevelObj.logLabel + '|' + args[0];
                    }

                    logFn.apply(null, args);
                };
            }
        }
    }

    ////////////////////

    function getLogLevelObj(logLevelName) {
        if (logLevelName == null) { throw new Error('Provided logLevelName cannot be null!'); }

        var foundLogLevel = null;

        angular.forEach(_LOG_LEVELS, function(value, key) {
            if (value.name === logLevelName) {
                foundLogLevel = _LOG_LEVELS[key];
            }
        });

        if (foundLogLevel == null) {
            throw new Error('Invalid log level name provided: ' + logLevelName);
        }

        return foundLogLevel;
    }

})();
