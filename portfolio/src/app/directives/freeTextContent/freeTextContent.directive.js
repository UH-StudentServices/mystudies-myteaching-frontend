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
  'directives.editLink',
  'constants.ngEmbedOptions'])

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

  .directive('freeTextContent', function(FreeTextContentService,
                                         FreeTextContentFactory,
                                         VerificationDialog,
                                         PreviewService,
                                         NG_EMBED_OPTIONS,
                                         $translate) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/freeTextContent/freeTextContent.html',
      scope: {
        portfolioSection: '@',
        instanceName: '@',
        headingKey: '@?',
        portfolioLang: '@',
        deletable: '='
      },
      link: function(scope, el, attrs) {
        var visibilityDescriptor = getVisibilityDescriptor(),
            freeTextContentSubject;

        function getVisibilityDescriptor() {
          return {
            portfolioSection: scope.portfolioSection || null,
            instanceName: scope.instanceName || null
          };
        }

        function getMatchingItem(freeTextContentItems, searchCriteria) {
          var filteredFreeTextContentItems = freeTextContentItems.filter(_.matches(searchCriteria)),
              newFreeTextContentItem;

          if (filteredFreeTextContentItems.length > 1) {
            throw Error('Multiple matching free-text content items');
          }

          return filteredFreeTextContentItems[0];
        }

        function createMatchingItem() {
          return scope.headingKey ?
            FreeTextContentFactory.fixedFreeTextContent(visibilityDescriptor, scope.headingKey) :
            FreeTextContentFactory.defaultFreeTextContent(visibilityDescriptor);
        }

        function subscribeToChanges() {
          freeTextContentSubject = FreeTextContentService.getFreeTextContentSubject();

          freeTextContentSubject.subscribe(function(freeTextContentItems) {
            var matchingItem = getMatchingItem(freeTextContentItems, visibilityDescriptor);

            if (matchingItem) {
              scope.freeTextContentItem = matchingItem;
            }
          });
        }

        function isTranslatableHeading() {
          return scope.headingKey && $translate.instant(scope.headingKey) === scope.freeTextContentItem.title;
        }

        function updateOrCreateNew() {
          var serviceFn;

          if (getMatchingItem(freeTextContentSubject.getValue(), visibilityDescriptor)) {
            serviceFn = 'updateFreeTextContent';
          } else {
            serviceFn = 'insertFreeTextContent';
          }

          FreeTextContentService[serviceFn](scope.freeTextContentItem, visibilityDescriptor)
            .then(scope.toggleEdit);

          return true;
        }

        function confirmDelete() {
          VerificationDialog.open('general.reallyDelete', 'general.ok', 'general.cancel', deleteItem, function() {});
        }

        function deleteItem() {
          FreeTextContentService.deleteFreeTextContent(scope.freeTextContentItem, visibilityDescriptor);
        }

        function init() {
          FreeTextContentService.getInitialData().then(function(initialData) {
            var matchingItem = getMatchingItem(initialData, visibilityDescriptor);

            scope.freeTextContentItem = matchingItem || createMatchingItem();
          }).then(subscribeToChanges);
        }

        _.assign(scope, {
          deleteItem: deleteItem,
          confirmDelete: confirmDelete,
          updateOrCreateNew: updateOrCreateNew,
          toggleEdit: function() {
            scope.isEditing = !scope.isEditing;
          },
          embedOptions: NG_EMBED_OPTIONS,
          isTranslatableHeading: isTranslatableHeading,
          isPreview: PreviewService.isPreview()
        });

        init();
      }
    };
  });
