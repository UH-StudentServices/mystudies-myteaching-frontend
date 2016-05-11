angular.module('directives.helpIcon', ['directives.popover'])

  .directive('helpIcon', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        translationKey: '@'
      },
      templateUrl: 'app/directives/helpIcon/helpIcon.html'
    };
  });
