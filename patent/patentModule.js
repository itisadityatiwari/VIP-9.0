// Task: PROF-53 | VIP-19, croja022 (add patent feature)
// Initial file creation and implementation.
(function() {
    'use strict';

    angular
    .module('patent', ['ui.router', 'datatables', 'datatables.buttons', 'datatables.scroller', 'datatables.select','ngAnimate', 'ngSanitize', 'ui.bootstrap'])
    .config(function($urlRouterProvider, $stateProvider) {
        $stateProvider
        .state('patent.home', {
            url: '',
            templateUrl: 'features/patent/patentLanding.html',
        })
        .state('patent.search', {
            url: '/search',
            templateUrl: 'features/patent/patentSearch.html',
            controller: 'patentSearchController',
            controllerAs: 'vm'
        })
        .state('patent.success', {
            url: '/success-stories',
            templateUrl: 'features/patent/patentSuccessStories.html',
            controller: 'patentSuccessStoriesController',
            controllerAs: 'vm'
        })
        .state('patent.business', {
            url: '/business-search',
            templateUrl: 'features/patent/patentBusinessSearch.html',
            controller: 'patentBusinessSearchController',
            controllerAs: 'vm'
        })
        $urlRouterProvider.otherwise('/');
    });
})();
