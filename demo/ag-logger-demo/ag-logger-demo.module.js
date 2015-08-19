(function() { 'use strict';

    angular.module('agLoggerDemo', []).
        config(configStates);

    ////////////////////

    function configStates($stateProvider) {
        $stateProvider.
            state('agLoggerDemo', {
                url: '/ag-logger-demo',
                templateUrl: 'demo/ag-logger-demo/ag-logger-demo.html',
                controller: 'LoggerDemoCtrl as vm'
            });
    }

})();