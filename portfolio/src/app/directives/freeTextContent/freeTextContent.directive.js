angular.module('directives.freeTextContent', [
  'services.freeTextContent',
  'directives.editFreeText',
  'directives.editLink'])

  .factory('FreeTextContentFactory', function($filter) {

    var defaultTitle = $filter('translate')('freeTextContent.defaultTitle'),
        defaultText = $filter('translate')('freeTextContent.defaultText');

    return {
      defaultFreeTextContent: function() {
        return {
          title: defaultTitle,
          text: defaultText
        };
      }
    };
  })

  .directive('freeTextContent', function(FreeTextContentService, FreeTextContentFactory) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/freeTextContent/freeTextContent.html',
      scope: {
        freeTextContentData: '&'
      },
      link: function($scope) {
        $scope.freeTextContents = $scope.freeTextContentData();

        $scope.editFreeTextContent = function(freeTextContent) {
          $scope.freeTextContentToEdit = freeTextContent;
        };

        $scope.insertFreeTextContent = function() {
          FreeTextContentService
            .insertFreeTextContent(FreeTextContentFactory.defaultFreeTextContent())
            .then(function(freeTextContent) {
              $scope.freeTextContents.push(freeTextContent);
              $scope.freeTextContentToEdit = freeTextContent;
            });
        };

        $scope.updateFreeTextContent = function() {
          FreeTextContentService.updateFreeTextContent($scope.freeTextContentToEdit)
            .then(function() {
              $scope.freeTextContentToEdit = null;
            });
        };

        $scope.deleteFreeTextContent = function() {
          FreeTextContentService.deleteFreeTextContent($scope.freeTextContentToEdit)
            .then(function() {
              _.remove($scope.freeTextContents, {id: $scope.freeTextContentToEdit.id});
              $scope.freeTextContentToEdit = null;
            });
        };
      }
    };
  });
