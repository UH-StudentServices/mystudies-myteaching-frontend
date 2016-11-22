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

angular.module('directives.courseRecommendations', ['resources.courseRecommendations',
                                                    'opintoniAnalytics'])

  .constant('RECOMMENDATIONS_LOADER_KEY', 'recommendations')
  .constant('RECOMMENDATIONS_DEFAULT_AMOUNT', 5)
  .constant('RECOMMENDATIONS_MAX_AMOUNT', 20)

  .directive('courseRecommendations', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/courseRecommendations/courseRecommendations.html',
      scope: {},
      controller: function($scope,
                           CourseRecommendationsResource,
                           Loader,
                           RECOMMENDATIONS_LOADER_KEY,
                           RECOMMENDATIONS_DEFAULT_AMOUNT,
                           RECOMMENDATIONS_MAX_AMOUNT,
                           AnalyticsService) {

        $scope.trackRecommendationLinkClick = function(courseName) {
          AnalyticsService.trackCourseRecommendationLinkClick(courseName);
        };

        $scope.limit = RECOMMENDATIONS_DEFAULT_AMOUNT;

        $scope.showMore = function() {
          $scope.limit = RECOMMENDATIONS_MAX_AMOUNT;
        }

        $scope.showLess = function() {
          $scope.limit = RECOMMENDATIONS_DEFAULT_AMOUNT;
        }

        Loader.start(RECOMMENDATIONS_LOADER_KEY);

        CourseRecommendationsResource.getCourseRecommendations()
          .then(function(courseRecommendations) {
            $scope.courseRecommendations = courseRecommendations;
          })
          .finally(function() {
            Loader.stop(RECOMMENDATIONS_LOADER_KEY);
          });
      }
    };
  });
