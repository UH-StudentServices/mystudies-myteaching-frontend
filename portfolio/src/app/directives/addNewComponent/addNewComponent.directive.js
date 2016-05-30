angular.module('directives.addNewComponent', [])
  .directive('addNewComponent', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        onClick: '&?'
      },
      templateUrl: 'app/directives/addNewComponent/addNewComponent.html'
    };
  });
