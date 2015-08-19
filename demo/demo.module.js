(function() { 'use strict';

    angular.module('demo', [
        //vendor
        'ui.router',

        // demo
        'agLoggerDemo',
        'topNav',

        // library dependencies
        'agLogger'
    ]).
        config(configDefaultState).
        config(configLogging);

    ////////////////////

    function configDefaultState($urlRouterProvider) {
        $urlRouterProvider.otherwise('/ag-logger-demo');
    }

    function configLogging(agLoggerProvider) {
        agLoggerProvider.enableAll();
    }

})();