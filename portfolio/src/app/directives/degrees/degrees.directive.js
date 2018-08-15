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
  'directives.editDegrees',
  'directives.editableHeading'
])
.directive('degrees', function(DegreeService,
                               $state) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      degreesData: '&',
      portfolioId: '@',
      portfolioLang: '@',
      sectionName: '@'
    },
    templateUrl: 'app/directives/degrees/degrees.html',
    link: function($scope) {
      $scope.degrees = $scope.degreesData();
      $scope.editing = false;
      $scope.newDegree = {};
      $scope.degreesValid = true;

      $scope.edit = function() {
        $scope.editing = true;
      };

      var isValid = function() {
        return $scope.degrees.every(function(degree) {
          return degree.title && degree.dateOfDegree;
        });
      };

      $scope.refreshValidity = _.debounce(function() {
        $scope.degreesValid = isValid();
      }, 500);

      $scope.markAllSubmitted = function() {
        $scope.degrees.forEach(function(degree) { degree.submitted = true; });
      };

      $scope.exitEdit = function() {
        $scope.$broadcast('saveComponent');
        $scope.markAllSubmitted();

        if (isValid()) {
          DegreeService.updateDegrees($scope.portfolioId, $scope.degrees).then(function(data) {
            $scope.degrees = data;
            $scope.editing = false;
            $state.reload(); // https://jira.it.helsinki.fi/browse/OO-1004
          });
        }
        return true;
      };
    }
  };
});
