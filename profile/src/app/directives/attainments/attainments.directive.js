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

angular.module('directives.attainments', [
  'services.profile',
  'resources.attainment',
  'filters.moment',
  'filters.formatting',
  'directives.editButton',
  'directives.editableHeading',
  'profileAnalytics'
])

  .directive('attainments', function (AttainmentResource, AnalyticsService, $state) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/attainments/attainments.html',
      scope: {
        profileId: '@',
        profileLang: '@'
      },
      link: function ($scope) {
        var SHOW_MORE_ADDITION = 5;
        var MAX_GRADE_CHAR_COUNT = 4;

        $scope.editing = false;
        $scope.numberOfVisibleAttainments = 5;
        $scope.attainments = [];

        $scope.formatGrade = function (grade) {
          if (_.endsWith(grade, '.')) {
            return grade.substring(0, grade.length - 1);
          }
          return grade;
        };

        $scope.gradeClass = function (grade) {
          return Math.max(1, Math.min(MAX_GRADE_CHAR_COUNT, $scope.formatGrade(grade).length));
        };

        $scope.edit = function edit() {
          $scope.editing = true;
          $scope.origWhitelist = $scope.whitelist.slice();
          AttainmentResource.getAll($scope.profileLang)
            .then(function attainmentsSuccess(attainments) {
              $scope.allAttainments = attainments;
            });
        };

        function updateWhitelistedAttainments() {
          AttainmentResource.getAllWhitelisted($scope.profileId, $scope.profileLang)
            .then(function (attainments) {
              $scope.attainments = attainments;
            });
        }

        $scope.exitEdit = function exitEdit() {
          AnalyticsService.trackEventIfAdded($scope.origWhitelist,
            $scope.whitelist,
            AnalyticsService.ec.ATTAINMENTS,
            AnalyticsService.ea.SET_VISIBILITY,
            AnalyticsService.el.VISIBLE);

          $scope.$broadcast('saveComponent');
          $scope.editing = false;

          AttainmentResource
            .updateWhitelist($scope.profileId, {
              showGrades: $scope.showGrades.val,
              oodiStudyAttainmentIds: $scope.whitelist
            })
            .then(updateWhitelistedAttainments);

          return true;
        };

        AttainmentResource.getWhitelist($scope.profileId).then(function (whitelist) {
          $scope.showGrades = { val: whitelist.showGrades };
          $scope.whitelist = whitelist.oodiStudyAttainmentIds;
        });

        $scope.isVisible = function isVisible(attainment) {
          return $scope.whitelist.indexOf(attainment.studyAttainmentId) !== -1;
        };

        $scope.toggleVisibility = function toggleVisibility(attainment) {
          var index;
          if (!_.isUndefined($scope.whitelist)) {
            index = $scope.whitelist.indexOf(attainment.studyAttainmentId);

            if (index !== -1) {
              $scope.whitelist.splice(index, 1);
            } else {
              $scope.whitelist.push(attainment.studyAttainmentId);
            }
          }
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.numberOfVisibleAttainments < $scope.attainments.length;
        };

        $scope.showMoreClick = function showMoreClick() {
          $scope.numberOfVisibleAttainments += SHOW_MORE_ADDITION;
        };

        $scope.cancelEdit = function () {
          $scope.editing = false;
          $state.reload();
        };

        updateWhitelistedAttainments();
      }
    };
  }).directive('toggleSwitch', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/attainments/toggleSwitch.html',
      scope: { ngModel: '=' },
      link: function (scope) {
        scope.toggle = function () {
          scope.ngModel.val = !scope.ngModel.val;
        };
      }
    };
  });

