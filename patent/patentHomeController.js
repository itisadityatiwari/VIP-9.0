// Task: PROF-53 | VIP-19, croja022 (add patent feature)
// Initial file creation and implementation.
(function () {
    'use strict';

    angular
        .module('patent')
        .controller('patentHomeController', patentHomeController);
        patentHomeController.$inject = ['DTOptionsBuilder', 'DTColumnBuilder','$sce', '$location', '$state', '$scope', '$stateParams', 'User', '$window'];
        function patentHomeController(DTOptionsBuilder, DTColumnBuilder, $sce, $location, $state, $scope, $stateParams, User, $window) {
            var vm = this;
            vm.done = false;
            vm.message = "welcome to the Patent & Licensing landing page";
            vm.done = true;
            var vm = this;
        }
    })();