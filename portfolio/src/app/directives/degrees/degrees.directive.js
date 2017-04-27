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

angular.module('directives.degrees', [
  'services.degree',
  'directives.showDegrees',
  'directives.editDegrees'
])
.directive('degrees', function(DegreeService, momentDateToLocalDateArray, $filter) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      degreesData: '&',
      portfolioId: '@',
      sectionName: '@'
    },
    templateUrl: 'app/directives/degrees/degrees.html',
    link: function($scope) {
      var orderBy = $filter('orderBy');

      $scope.degrees = DegreeService.formatDates($scope.degreesData());
      $scope.degrees = orderBy($scope.degrees, '-dateOfDegree');

      $scope.editing = false;
      $scope.newDegree = {};
      $scope.degreesValid = true;

      $scope.edit = function() {
        $scope.editing = true;
      };

      var isValid = function() {
        return $scope.degrees.every(function(degree) {
          return degree.title && degree.dateOfDegree.isValid();
        });
      };

      $scope.refreshValidity = _.debounce(function() {
        $scope.degreesValid = isValid();
      }, 500);

      $scope.markAllSubmitted = function() {
        $scope.degrees.forEach(function(degree) { degree.submitted = true; });
      };

      $scope.exitEdit = function() {
        $scope.markAllSubmitted();

        if (isValid()) {
          var updateDegrees = angular.copy($scope.degrees);

          _.forEach(updateDegrees, function(degree) {
            degree.dateOfDegree = momentDateToLocalDateArray(degree.dateOfDegree);
          });

          DegreeService.updateDegrees($scope.portfolioId, updateDegrees).then(function(data) {
            $scope.degrees = orderBy(data, '-dateOfDegree');
            $scope.editing = false;
          });
          return true;
        }
      };
    }
  };
});
