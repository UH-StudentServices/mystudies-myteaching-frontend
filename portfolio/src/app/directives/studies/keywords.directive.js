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

angular.module('directives.keywords', ['services.keyword', 'directives.inputUppercase', 'portfolioAnalytics'])

  .directive('keywords', function ($filter, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        editing: '=',
        keywords: '='
      },
      templateUrl: 'app/directives/studies/keywords.html',
      link: function ($scope) {
        $scope.newKeyword = {};

        $scope.addKeyword = function (title) {
          if (!_.isEmpty(title) && !_.find($scope.keywords, { title: title })) {
            AnalyticsService.trackEvent(
              AnalyticsService.ec.STUDIES,
              AnalyticsService.ea.ADD_KEYWORD
            );

            $scope.keywords.push({ title: title });
            $scope.newKeyword = {};
          }
        };

        $scope.removeKeyword = function (keyword) {
          _.remove($scope.keywords, keyword);
        };
      }
    };
  })

  .directive('keywordsSummary', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/studies/keywordsSummary.html',
      scope: {
      },
      controller: function ($scope, KeywordService) {
        KeywordService.getKeywordsSubject()
          .subscribe(function (keywords) {
            $scope.keywords = keywords;
          });
      }
    };
  });
