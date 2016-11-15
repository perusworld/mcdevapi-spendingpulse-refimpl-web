angular.module('spulse.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.spendingPulse', {
        url: '/spending-pulse',
        views: {
          'tab-spendingPulse': {
            templateUrl: 'templates/tab-spendingpulse.html',
            controller: 'SpendingPulseCtrl'
          }
        }
      })
      .state('tab.gasWeekly', {
        url: '/gas-weekly',
        views: {
          'tab-gasWeekly': {
            templateUrl: 'templates/tab-gasweekly.html',
            controller: 'GasWeeklyCtrl'
          }
        }
      })
      .state('tab.subscriptions', {
        url: '/subscriptions',
        views: {
          'tab-subscriptions': {
            templateUrl: 'templates/tab-subscriptions.html',
            controller: 'SubscriptionsCtrl'
          }
        }
      })
      .state('tab.parameters', {
        url: '/parameters',
        views: {
          'tab-parameters': {
            templateUrl: 'templates/tab-parameters.html',
            controller: 'ParametersCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/tab/spending-pulse');

  });
