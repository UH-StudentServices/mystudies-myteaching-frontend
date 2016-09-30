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
        freeTextContentData: '=',
        portfolioSection: '@'
      },
      link: function(scope) {
        scope.freeTextContents = scope.freeTextContentData;

        if (scope.portfolioSection) {
          scope.freeTextContents = scope.freeTextContents.filter(function(el) {
            return el.portfolioSection === scope.portfolioSection;
          });
        }

        scope.editFreeTextContent = function(freeTextContent) {
          scope.freeTextContentToEdit = freeTextContent;
        };

        scope.insertFreeTextContent = function() {
          FreeTextContentService
            .insertFreeTextContent(FreeTextContentFactory.defaultFreeTextContent(scope.portfolioSection))
            .then(function(freeTextContent) {
              scope.freeTextContentToEdit = freeTextContent;
            });
        };

        scope.updateFreeTextContent = function() {
          FreeTextContentService.updateFreeTextContent(scope.freeTextContentToEdit)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
        };

        scope.deleteFreeTextContent = function() {
          FreeTextContentService.deleteFreeTextContent(scope.freeTextContentToEdit)
            .then(function() {
              _.remove(scope.freeTextContents, {id: scope.freeTextContentToEdit.id});
              scope.freeTextContentToEdit = null;
            });
        };
      }
    };
  });
