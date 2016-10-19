angular.module('directives.freeTextContent', [
  'services.freeTextContent',
  'directives.editFreeText',
  'directives.editLink'])

  .factory('FreeTextContentFactory', function($filter) {

    var defaultTitle = $filter('translate')('freeTextContent.defaultTitle'),
        defaultText = $filter('translate')('freeTextContent.defaultText');

    return {
      defaultFreeTextContent: function(section) {
        return {
          title: defaultTitle,
          text: defaultText,
          portfolioSection: section
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
        portfolioSection: '@'
      },
      link: function(scope) {
        function refreshContent(freeTextContent) {
          scope.freeTextContents = freeTextContent;
          return freeTextContent;
        }

        scope.freeTextContents = FreeTextContentService
          .getFreeTextContent(scope.portfolioSection)
          .then(refreshContent);

        scope.editFreeTextContent = function(freeTextContent) {
          scope.freeTextContentToEdit = freeTextContent;
        };

        scope.insertFreeTextContent = function() {
          FreeTextContentService
            .insertFreeTextContent(FreeTextContentFactory
              .defaultFreeTextContent(scope.portfolioSection), scope.portfolioSection)
            .then(refreshContent)
            .then(function(freeTextContent) {
              scope.freeTextContentToEdit = freeTextContent[freeTextContent.length -1];
            });
        };

        scope.updateFreeTextContent = function() {
          FreeTextContentService.updateFreeTextContent(scope.freeTextContentToEdit, scope.portfolioSection)
            .then(refreshContent)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
        };

        scope.deleteFreeTextContent = function() {
          FreeTextContentService.deleteFreeTextContent(scope.freeTextContentToEdit, scope.portfolioSection)
            .then(refreshContent)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
        };
      }
    };
  });
