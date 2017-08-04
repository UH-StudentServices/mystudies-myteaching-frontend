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
  'directives.summary'])

.directive('studies', function(KeywordService, SummaryService, ComponentHeadingService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      summaryData: '&',
      portfolioId: '@',
      portfolioLang: '@',
      headingKey: '@',
      sectionName: '@',
      getHeadingOrDefault: '&'
    },
    templateUrl: 'app/directives/studies/studies.html',
    link: function($scope) {
      var portfolioId = $scope.portfolioId,
          HEADING_I18N_KEY = 'studies.title',
          COMPONENT_KEY = 'STUDIES';

      function edit() {
        $scope.editing = true;
      }
      $scope.component = $scope.getHeadingOrDefault({componentId: COMPONENT_KEY,
                                                     i18nKey: HEADING_I18N_KEY,
                                                     lang: $scope.portfolioLang
      });
      $scope.oldTitle = $scope.component.heading;

      $scope.saveTitle = function() {
        if ($scope.component.heading !== $scope.oldTitle) {
          ComponentHeadingService.updateHeading($scope.component)
            .then(function(component) {
              if (component.heading) {
                $scope.oldTitle = component.heading;
              }
            });
          return true;
        }
        return false;
      };

      function exitEdit() {

        var updateKeywordsRequest = {
          keywords: $scope.keywords
        };

        var updateSummaryRequest = {
          summary: $scope.summary
        };

        $scope.saveTitle();

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
        headingKey: $scope.headingKey || HEADING_I18N_KEY,
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
