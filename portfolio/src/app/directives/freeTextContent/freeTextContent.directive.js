angular.module('directives.freeTextContent', [
  'services.freeTextContent',
  'directives.editFreeText',
  'directives.editLink'])

  .factory('FreeTextContentFactory', function($filter) {

    var defaultTitle = $filter('translate')('freeTextContent.defaultTitle'),
        defaultText = $filter('translate')('freeTextContent.defaultText');

    return {
      defaultFreeTextContent: function(visibilityDescriptor) {
        return _.assign({}, visibilityDescriptor, {
          title: defaultTitle,
          text: defaultText
        });
      }
    };
  })

  .directive('freeTextContent', function(FreeTextContentService, FreeTextContentFactory) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/freeTextContent/freeTextContent.html',
      scope: {
        portfolioSection: '@',
        instanceName: '@'
      },
      link: function(scope) {
        var visibilityDescriptor = {
          portfolioSection: scope.portfolioSection || null,
          instanceName: scope.instanceName || null
        };

        function refreshContent(freeTextContent) {
          scope.freeTextContents = freeTextContent;
          return freeTextContent;
        }

        scope.freeTextContents = FreeTextContentService
          .getFreeTextContent(visibilityDescriptor)
          .then(refreshContent);

        scope.editFreeTextContent = function(freeTextContent) {
          scope.freeTextContentToEdit = freeTextContent;
        };

        scope.insertFreeTextContent = function() {
          FreeTextContentService
            .insertFreeTextContent(FreeTextContentFactory
              .defaultFreeTextContent(visibilityDescriptor), visibilityDescriptor)
            .then(refreshContent)
            .then(function(freeTextContent) {
              scope.freeTextContentToEdit = freeTextContent[freeTextContent.length -1];
            });
        };

        scope.updateFreeTextContent = function() {
          FreeTextContentService.updateFreeTextContent(scope.freeTextContentToEdit, visibilityDescriptor)
            .then(refreshContent)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
        };

        scope.deleteFreeTextContent = function() {
          FreeTextContentService.deleteFreeTextContent(scope.freeTextContentToEdit, visibilityDescriptor)
            .then(refreshContent)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
        };
      }
    };
  });
