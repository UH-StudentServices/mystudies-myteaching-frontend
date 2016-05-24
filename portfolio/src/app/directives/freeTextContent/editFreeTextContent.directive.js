angular.module('directives.editFreeText', [])

  .directive('editFreeTextContent', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        freeTextContent: '=',
        onRemove: '&',
        onOk: '&'
      },
      templateUrl: 'app/directives/freeTextContent/editFreeTextContent.html',
      link: function($scope) {
        $scope.editingTitle = false;
        $scope.editTitle = function() {
          $scope.editingTitle = !$scope.editingTitle;
        };
      }
    };
  });