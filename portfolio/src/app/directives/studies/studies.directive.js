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
  'directives.summary',
  'directives.mutableHeading'])

.directive('studies', function(KeywordService, SummaryService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      summaryData: '&',
      portfolioId: '@',
      portfolioLang: '@',
      headingKey: '@',
      sectionName: '@'
    },
    templateUrl: 'app/directives/studies/studies.html',
    link: function($scope) {
      var portfolioId = $scope.portfolioId;

      $scope.saveHeading = {};

      function edit() {
        $scope.editing = true;
      }

      function exitEdit() {

        var updateKeywordsRequest = {
          keywords: $scope.keywords
        };

        var updateSummaryRequest = {
          summary: $scope.summary
        };

        if ($scope.saveHeading.func) {
          $scope.saveHeading.func();
        }

        _.forEach(updateKeywordsRequest.keywords, function(keyword, index) {
          keyword.orderIndex = index;
        });

        $scope.editing = false;

        SummaryService.updateSummary(portfolioId, updateSummaryRequest);
        KeywordService.updateKeywords(portfolioId, updateKeywordsRequest)
          .then(function(keywords) {
            $scope.keywords = keywords;
          });

        return true;
      }

      _.assign($scope, {
        summary: $scope.summaryData(),
        headingKey: $scope.headingKey || '',
        edit: edit,
        exitEdit: exitEdit
      });

      KeywordService.getKeywordsSubject()
        .subscribe(function(keywords) {
          $scope.keywords = keywords;
        });
    }
  };
});
