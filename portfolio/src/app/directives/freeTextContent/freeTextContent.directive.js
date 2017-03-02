/*
 * This file is part of MystudiesMyteaching application.
 *
 * MystudiesMyteaching application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MystudiesMyteaching application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MystudiesMyteaching application.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('directives.freeTextContent', [
  'services.freeTextContent',
  'directives.editFreeText',
  'directives.editLink'])

  .factory('FreeTextContentFactory', function($translate) {

    var defaultTitle = $translate.instant('freeTextContent.defaultTitle'),
        defaultText = $translate.instant('freeTextContent.defaultText');

    return {
      defaultFreeTextContent: function(visibilityDescriptor) {
        return _.assign({}, visibilityDescriptor, {
          title: defaultTitle,
          text: defaultText
        });
      },
      fixedFreeTextContent: function(visibilityDescriptor, headingKey) {
        return _.assign({}, visibilityDescriptor, {
          title: $translate.instant(headingKey),
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
        instanceName: '@',
        singleEntry: '@?',
        headingKey: '@?'
      },
      link: function(scope, el ,attrs) {
        var visibilityDescriptor = {
          portfolioSection: scope.portfolioSection || null,
          instanceName: scope.instanceName || null
        };

        function refreshContent(freeTextContent) {
          scope.freeTextContents = freeTextContent;
          return freeTextContent;
        }

        function conditionalFixedEntry(freeTextContent) {
          if (!freeTextContent.length && scope.headingKey) {
            scope.insertFreeTextContent(true);
          }
        }

        function setEditableEntry(freeTextContent) {
          if (!scope.headingKey) {
            scope.freeTextContentToEdit = freeTextContent[freeTextContent.length - 1];
          }
        }

        scope.embedOptions = {
          video: {
            embed: true,
            width: null,
            height: null,
            ytTheme: 'dark',
            details: false,
            thumbnailQuality: 'medium',
            autoPlay: false
          },
          code: {
            highlight: false
          },
          gdevAuth: true,
          tweetEmbed: false,
          image: {
            embed: true
          }
        };

        scope.disableAddNew = 'singleEntry' in attrs;

        scope.freeTextContents = FreeTextContentService
          .getFreeTextContent(visibilityDescriptor)
          .then(refreshContent)
          .then(conditionalFixedEntry);

        scope.editFreeTextContent = function(freeTextContent) {
          scope.freeTextContentToEdit = freeTextContent;
        };

        scope.insertFreeTextContent = function(useFixedEntry) {
          var entry = useFixedEntry ?
            FreeTextContentFactory.fixedFreeTextContent(visibilityDescriptor, scope.headingKey) :
            FreeTextContentFactory.defaultFreeTextContent(visibilityDescriptor);

          FreeTextContentService
            .insertFreeTextContent(entry, visibilityDescriptor)
            .then(refreshContent)
            .then(setEditableEntry);
        };

        scope.updateFreeTextContent = function() {
          FreeTextContentService.updateFreeTextContent(scope.freeTextContentToEdit, visibilityDescriptor)
            .then(refreshContent)
            .then(function() {
              scope.freeTextContentToEdit = null;
            });
          return true;
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
