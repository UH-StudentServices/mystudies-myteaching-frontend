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

angular.module('directives.editDegrees', ['services.visibility'])

  .directive('editDegrees', function (Visibility) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/degrees/editDegrees.html',
      link: function ($scope) {
        var newDegree = { visibility: Visibility.PUBLIC };
        $scope.newDegree = newDegree;
        $scope.addDegree = function (degree) {
          $scope.degrees.push(degree);
          $scope.newDegree = newDegree;
          $scope.refreshValidity();
        };

        $scope.removeDegree = function (degree) {
          $scope.degrees = _.without($scope.degrees, degree);
          $scope.refreshValidity();
        };

        $scope.sortableOptions = {
          containment: '.degrees__dropzone',
          accept: function (sourceItemHandleScope, destSortableScope) {
            var sourceScopeParentId = sourceItemHandleScope.itemScope.sortableScope.$parent.$id;
            var destScopeParentId = destSortableScope.$parent.$id;
            return sourceScopeParentId === destScopeParentId;
          }
        };
      }
    };
  });
