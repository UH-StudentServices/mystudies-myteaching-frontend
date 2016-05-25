angular.module('directives.addNewComponent', [])
  .directive('addNewComponent', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/addNewComponent/addNewComponent.html'
    };
  });