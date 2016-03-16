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

angular.module('directives.courseRecommendations', ['resources.courseRecommendations'])

  .constant('RECOMMENDATIONS_LOADER_KEY', 'recommendations')

  .directive('courseRecommendations', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/courseRecommendations/courseRecommendations.html',
      scope: {},
      controller: function($scope,
                           CourseRecommendationsResource,
                           Loader,
                           RECOMMENDATIONS_LOADER_KEY) {
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
