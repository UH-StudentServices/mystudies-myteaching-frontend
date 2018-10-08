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
  'constants.ngEmbedOptions',
  'portfolioAnalytics'
])

  .factory('FreeTextContentFactory', function ($translate) {
    var defaultTitle = $translate.instant('freeTextContent.defaultTitle');

    var defaultText = $translate.instant('freeTextContent.defaultText');

    return {
      defaultFreeTextContent: function (visibilityDescriptor) {
        return _.assign({}, visibilityDescriptor, {
          title: defaultTitle,
          text: defaultText
        });
      },
      fixedFreeTextContent: function (visibilityDescriptor, headingKey, portfolioLang) {
        var lang = portfolioLang || $translate.use();

        return _.assign({}, visibilityDescriptor, {
          title: $translate.instant(headingKey, {}, '', lang),
          text: defaultText
        });
      }
    };
  })

  .directive('freeTextContent', function (FreeTextContentService,
    FreeTextContentFactory,
    VerificationDialog,
    PreviewService,
    NG_EMBED_OPTIONS,
    $translate,
    AnalyticsService) {
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
      link: function (scope) {
        function getVisibilityDescriptor() {
          return {
            portfolioSection: scope.portfolioSection || null,
            instanceName: scope.instanceName || null
          };
        }

        var visibilityDescriptor = getVisibilityDescriptor();
        var freeTextContentSubject;

        function getMatchingItem(freeTextContentItems, searchCriteria) {
          var filteredFreeTextContentItems = freeTextContentItems.filter(_.matches(searchCriteria));

          if (filteredFreeTextContentItems.length > 1) {
            throw Error('Multiple matching free-text content items');
          }

          return filteredFreeTextContentItems[0];
        }

        function createMatchingItem() {
          return scope.headingKey
            ? FreeTextContentFactory.fixedFreeTextContent(
              visibilityDescriptor,
              scope.headingKey,
              scope.portfolioLang
            )
            : FreeTextContentFactory.defaultFreeTextContent(visibilityDescriptor);
        }

        function subscribeToChanges() {
          freeTextContentSubject = FreeTextContentService.getFreeTextContentSubject();

          freeTextContentSubject.subscribe(function (freeTextContentItems) {
            var matchingItem = getMatchingItem(freeTextContentItems, visibilityDescriptor);

            if (matchingItem) {
              scope.freeTextContentItem = matchingItem;
            }
          });
        }

        function isTranslatableHeading() {
          var translatedHeading = scope.headingKey && $translate.instant(scope.headingKey);
          return translatedHeading === scope.freeTextContentItem.title;
        }

        function trackIfNeeded(oldText, newText) {
          var host = window.location.hostname;

          // <a href="https://student.helsinki.fi/api/public/v1/portfolio/files/olli-opiskelija/some.file">lalala</a>
          // eslint-disable-next-line max-len
          var hostedFilesRe = new RegExp('<a href="https?://' + host + '.*/api/(?:public|private)/v1/portfolio/files.*">.*</a>', 'gim');
          // eslint-disable-next-line no-useless-escape
          var imageRe = /((?:https?|ftp|file):\/\/\S*\.(?:gif|jpg|jpeg|tiff|png|svg|webp)(\?([\w=&_%\-]*))?)/gi;
          // eslint-disable-next-line max-len, no-useless-escape
          var linksRe = /(?:^|[^"'])(?:(https?|ftp|file):\/\/|www\.)[-A-Z0-9+()&@$#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi;

          function getOtherLinks(text) {
            return text.replace(imageRe, '').replace(hostedFilesRe, '').match(linksRe);
          }
          function getHostedFiles(text) {
            return text.match(hostedFilesRe);
          }
          function getImages(text) {
            return text.match(imageRe);
          }

          AnalyticsService.trackEventIfAdded(getHostedFiles(oldText), getHostedFiles(newText),
            AnalyticsService.ec.FREE_TEXT_CONTENT, AnalyticsService.ea.ADD_FILE);
          AnalyticsService.trackEventIfAdded(getImages(oldText), getImages(newText),
            AnalyticsService.ec.FREE_TEXT_CONTENT, AnalyticsService.ea.ADD_IMAGE);
          AnalyticsService.trackEventIfAdded(getOtherLinks(oldText), getOtherLinks(newText),
            AnalyticsService.ec.FREE_TEXT_CONTENT, AnalyticsService.ea.ADD_LINK);
        }

        function updateOrCreateNew() {
          var serviceFn;

          trackIfNeeded(scope.origFreeText, scope.freeTextContentItem.text);

          if (getMatchingItem(freeTextContentSubject.getValue(), visibilityDescriptor)) {
            serviceFn = 'updateFreeTextContent';
          } else {
            serviceFn = 'insertFreeTextContent';
          }

          FreeTextContentService[serviceFn](scope.freeTextContentItem, visibilityDescriptor)
            .then(scope.toggleEdit);

          return true;
        }

        function deleteItem() {
          FreeTextContentService.deleteFreeTextContent(
            scope.freeTextContentItem,
            visibilityDescriptor
          );
        }

        function confirmDelete() {
          VerificationDialog.open('general.reallyDelete', 'general.ok', 'general.cancel', deleteItem, function () {});
        }

        function toggleEdit() {
          scope.isEditing = !scope.isEditing;
          scope.origFreeText = scope.freeTextContentItem.text;
        }

        function init() {
          FreeTextContentService.getInitialData().then(function (initialData) {
            var matchingItem = getMatchingItem(initialData, visibilityDescriptor);

            scope.freeTextContentItem = matchingItem || createMatchingItem();
          }).then(subscribeToChanges);
        }

        _.assign(scope, {
          deleteItem: deleteItem,
          confirmDelete: confirmDelete,
          updateOrCreateNew: updateOrCreateNew,
          toggleEdit: toggleEdit,
          embedOptions: NG_EMBED_OPTIONS,
          isTranslatableHeading: isTranslatableHeading,
          isPreview: PreviewService.isPreview()
        });

        init();
      }
    };
  });
