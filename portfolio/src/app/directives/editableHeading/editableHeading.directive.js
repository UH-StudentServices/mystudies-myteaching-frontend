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

// MutableHeading is intended for portfolio section headers.

angular.module('directives.editableHeading', [
  'services.portfolio',
  'services.componentHeadingService'
]
)
  .directive('editableHeading', function($translate, PortfolioService, ComponentHeadingService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '@',
        defaultText: '@',
        portfolioLang: '@',
        editing: '<',
        saveSlot: '<'
      },
      templateUrl: 'app/directives/editableHeading/editableHeading.html',
      link: function($scope) {

        $scope.component = {
          component: $scope.componentId,
          heading: $translate.instant($scope.defaultText, {}, '', $scope.portfolioLang)
        };
        $scope.currentText = $scope.component.heading;

        PortfolioService.getPortfolio().then(function(portfolio) {
          var comp = _.find(portfolio.headings, {'component': $scope.componentId});

          if (comp && comp.heading) {
            $scope.component = comp;
            $scope.currentText = $scope.component.heading;
          }
        });

        $scope.saveHeading = function() {
          if ($scope.component.heading !== $scope.currentText) {
            ComponentHeadingService.updateHeading($scope.component)
              .then(function(component) {
                if (component.heading) {
                  $scope.currentText = component.heading;
                }
              });
            return true;
          }
          return false;
        };
        if ($scope.saveSlot !== undefined) {
          // Ignore the warning. 'saveSlot' makes saveHeading accessible for the element that gave it to us.
          $scope.saveSlot.func = $scope.saveHeading;
        }
      }
    };
  });
