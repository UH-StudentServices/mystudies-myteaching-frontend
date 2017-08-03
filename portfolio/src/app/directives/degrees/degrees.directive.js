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
  'services.componentHeadingService',
  'directives.showDegrees',
  'directives.editDegrees'
])
.directive('degrees', function(DegreeService, ComponentHeadingService, $translate) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      degreesData: '&',
      portfolioId: '@',
      portfolioLang: '@',
      getHeading: '&',
      sectionName: '@'
    },
    templateUrl: 'app/directives/degrees/degrees.html',
    link: function($scope) {
      $scope.degrees = DegreeService.formatDates($scope.degreesData());

      $scope.editing = false;
      $scope.newDegree = {};
      $scope.degreesValid = true;

      function getDefaultTitle() {
        return $translate.instant('degrees.title', {}, '', $scope.portfolioLang);
      }

      $scope.component = $scope.getHeading({component: 'DEGREES'});
      if (!$scope.component) {
        $scope.component = {component: 'DEGREES', heading: getDefaultTitle()};
      }
      $scope.componentTitle = $scope.component.heading;

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

      $scope.saveTitle = function() {
        if ($scope.component.heading !== $scope.componentTitle) {
          ComponentHeadingService.updateHeading($scope.component)
            .then(function(component) {
              if (component.heading) {
                $scope.componentTitle = component.heading;
              } else {
                $scope.componentTitle = getDefaultTitle();
              }
            });
          return true;
        }
        return false;
      };

      $scope.exitEdit = function() {
        var changed = $scope.saveTitle();

        $scope.markAllSubmitted();

        if (isValid()) {
          DegreeService.updateDegrees($scope.portfolioId, $scope.degrees).then(function(data) {
            $scope.degrees = data;
            $scope.editing = false;
          });
          changed = true;
        }
        return changed;
      };
    }
  };
});
