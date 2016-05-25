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

'use strict';

angular.module('directives.editDegrees', [
  'directives.dateInput'
])

  .directive('editDegrees', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/degrees/editDegrees.html',
      link: function($scope) {

        $scope.editTitle = function(degree) {
          degree.titleEdit = true;
        };

        $scope.exitTitleEdit = function(degree) {
          degree.titleEdit = false;
        };

        $scope.editDescription = function(degree) {
          degree.descriptionEdit = true;
        };

        $scope.exitDescriptionEdit = function(degree) {
          degree.descriptionEdit = false;
        };

        $scope.editDateOfDegree = function(degree) {
          degree.dateOfDegreeEdit = true;
        };

        $scope.exitDateOfDegreeEdit = function(degree) {
          if (!degree.dateOfDegree.isValid()) {
            degree.dateOfDegree = moment();
          }
          degree.dateOfDegreeEdit = false;
        };

        $scope.addDegree = function(degree) {
          degree.dateOfDegree = moment();
          $scope.degrees.push(degree);
          $scope.newDegree = {};
        };

        $scope.removeDegree = function(degree) {
          $scope.degrees = _.without($scope.degrees, degree);
        };
      }
    };
  });
