angular.module('spulse', ['ionic', 'spulse.controllers', 'spulse.routes', 'spulse.services', 'spulse.api', 'nvd3ChartDirectives', 'angularMoment'])

  .config(
  [function () {
  }]
  )

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    });
  });
