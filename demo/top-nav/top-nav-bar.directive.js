(function() { 'use strict';

    angular.module('topNav').
        directive('topNavBar', topNavBarDirective);

    ////////////////////

    function topNavBarDirective() {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'demo/top-nav/top-nav-bar.html',
            controller: TopNavBarCtrl,
            controllerAs: 'vm'
        };
    }

    function TopNavBarCtrl($http) {
        var vm = this;

        vm.clientVersion = null;

        init();

        ////////////////////

        function init() {
            $http.get('release/version.json').
             then(function(response) {
                vm.clientVersion = response.data.version;
            });
        }
    }

})();