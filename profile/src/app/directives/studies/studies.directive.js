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

angular.module('directives.studies', [
  'services.keyword',
  'services.summary',
  'directives.editLink',
  'directives.keywords',
  'directives.editableHeading',
  'constants.ngEmbedOptions',
  'profileAnalytics'
])

  .directive('studies', function (KeywordService, SummaryService, NG_EMBED_OPTIONS, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        summaryData: '=',
        profileId: '@',
        profileLang: '@'
      },
      templateUrl: 'app/directives/studies/studies.html',
      link: function (scope) {
        var profileId = scope.profileId;

        scope.embedOptions = NG_EMBED_OPTIONS;
        scope.editing = false;

        scope.edit = function () {
          scope.editing = true;
          scope.origText = scope.summaryData;
        };

        scope.exitEdit = function () {
          var updateKeywordsRequest = { keywords: scope.keywords };

          var updateSummaryRequest = { summary: scope.summaryData };

          scope.$broadcast('saveComponent');

          _.forEach(updateKeywordsRequest.keywords, function (keyword, index) {
            keyword.orderIndex = index;
          });

          scope.editing = false;

          if (scope.origText !== scope.summaryData) {
            AnalyticsService.trackEvent(
              AnalyticsService.ec.STUDIES,
              AnalyticsService.ea.EDIT_SUMMARY
            );
          }

          SummaryService.updateSummary(profileId, updateSummaryRequest);
          KeywordService.updateKeywords(profileId, updateKeywordsRequest)
            .then(function (keywords) {
              scope.keywords = keywords;
            });

          return true;
        };

        KeywordService.getKeywordsSubject()
          .subscribe(function (keywords) {
            scope.keywords = keywords;
          });
      }
    };
  });