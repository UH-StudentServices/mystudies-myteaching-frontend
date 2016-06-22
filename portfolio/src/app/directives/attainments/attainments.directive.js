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

angular.module('directives.attainments', [
  'services.portfolio',
  'resources.attainment',
  'filters.moment',
  'filters.formatting',
  'directives.editLink',
])

  .directive('attainments', function(AttainmentResource) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/attainments/attainments.html',
      scope: {
        portfolioId: '@'
      },
      link: function($scope) {
        var showMoreAddition = 5;

        $scope.editing = false;
        $scope.numberOfVisibleAttainments = 5;
        $scope.attainments = [];

        $scope.edit = function edit() {
          $scope.editing = true;
          AttainmentResource.getAll(9999).then(function attainmentsSuccess(attainments) {
            $scope.allAttainments = attainments;
          });
        };

        $scope.exitEdit = function exitEdit() {
          $scope.editing = false;

          AttainmentResource.updateWhitelist($scope.portfolioId, {
            oodiStudyAttainmentIds: $scope.whitelist
          }).then(updateWhitelistedAttainments);
        };

        AttainmentResource.getWhitelist($scope.portfolioId).then(function(whitelist) {
          $scope.whitelist = whitelist.oodiStudyAttainmentIds;
        });

        function updateWhitelistedAttainments() {
          AttainmentResource.getAllWhitelisted($scope.portfolioId)
            .then(function(attainments) {
              $scope.attainments = attainments;
            });
        }

        $scope.isVisible = function isVisible(attainment) {
          return $scope.whitelist.indexOf(attainment.studyAttainmentId) !== -1;
        };

        $scope.toggleVisibility = function toggleVisibility(attainment) {
          if (!_.isUndefined($scope.whitelist)) {
            var index = $scope.whitelist.indexOf(attainment.studyAttainmentId);

            if (index !== -1) {
              $scope.whitelist.splice(index, 1);
            } else {
              $scope.whitelist.push(attainment.studyAttainmentId);
            }
          }
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.numberOfVisibleAttainments <= $scope.attainments.length;
        };

        $scope.showMoreClick = function showMoreClick() {
          $scope.numberOfVisibleAttainments += showMoreAddition;
        };

        updateWhitelistedAttainments();
      }
    };
  });
