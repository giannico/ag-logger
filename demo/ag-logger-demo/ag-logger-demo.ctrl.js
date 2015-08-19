(function() { 'use strict';

    angular.module('agLoggerDemo').
        controller('LoggerDemoCtrl', LoggerDemoCtrl);

    ////////////////////

    var LOG_FUNCTIONS = [ 'error', 'warn', 'info', 'log', 'debug' ];

    function LoggerDemoCtrl($scope, $state, agLogger) {
        var vm = this;

        // The levels of the agLogger instance
        vm.loggerLevels = agLogger.LOG_LEVELS;

        // The levels the message will be logged at
        vm.logFunctionNames = LOG_FUNCTIONS;

        vm.logFormData = {
            loggerLevel: null,
            logFunctionName: null,
            message: null
        };

        vm.logMessage = logMessage;
        vm.willLog = willLog;

        init();

        ////////////////////////////////////////
        //// initialization
        ////////////////////////////////////////

        function init() {
            // set the initial logger level and log function
            vm.logFormData.loggerLevel = agLogger.getLogLevel();
            vm.logFormData.logFunctionName = vm.logFunctionNames[0];

            initWatchers();
        }

        function initWatchers() {
            $scope.$watch(function() { return vm.logFormData.loggerLevel; }, function(newLoggerLevel) {
                agLogger.setLogLevel(newLoggerLevel);
            });
        }

        ////////////////////////////////////////
        //// bindable actions
        ////////////////////////////////////////

        function logMessage(logFunctionName, message) {
            agLogger[logFunctionName](message);
            vm.logFormData.message = null;
        }

        function willLog(logFunctionName) {
            if (logFunctionName == null) {
                return false;
            }

            return agLogger.willLog(logFunctionName);
        }
    }

})();