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

angular.module('directives.workExperience', [
  'services.workExperience',
  'filters.moment',
  'directives.showWorkExperience',
  'directives.editWorkExperience',
  'directives.editableHeading',
  'profileAnalytics'
])

  .factory('OrderWorkExperience', function () {
    return function (workExperience) {
      return workExperience.startDate.unix();
    };
  })

  .directive('workExperience', function (WorkExperienceService,
    $state,
    AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        workExperienceData: '&',
        profileId: '@',
        profileLang: '@',
        sectionName: '@'
      },
      templateUrl: 'app/directives/workExperience/workExperience.html',
      link: function ($scope) {
        $scope.workExperience = WorkExperienceService.formatDates($scope.workExperienceData());
        $scope.editing = false;
        $scope.workExperienceValid = true;
        $scope.newJob = {};
        $scope.newJobSearch = {};

        WorkExperienceService.getJobSearchSubject().subscribe(function (jobSearch) {
          $scope.jobSearch = jobSearch;
        });

        $scope.edit = function () {
          $scope.editing = true;
          $scope.origWorkExperience = $scope.workExperience.slice();
          $scope.origJobSearch = _.clone($scope.jobSearch);
        };

        $scope.exitEdit = function () {
          if ($scope.workExperienceForm.$valid) {
            $scope.$broadcast('saveComponent');

            if ($scope.jobSearch !== null) {
              WorkExperienceService.saveJobSearch($scope.jobSearch);
              if (!$scope.origJobSearch) {
                AnalyticsService.trackEvent(
                  AnalyticsService.ec.JOB_SEARCH,
                  AnalyticsService.ea.ADD
                );
              }
            } else {
              WorkExperienceService.deleteJobSearch($scope.jobSearch);
            }

            AnalyticsService.trackEventIfAdded(
              $scope.origWorkExperience,
              $scope.workExperience,
              AnalyticsService.ec.WORK_EXPERIENCE, AnalyticsService.ea.ADD
            );

            WorkExperienceService.updateWorkExperience($scope.profileId, $scope.workExperience)
              .then(function (data) {
                $scope.workExperience = data;
                $scope.editing = false;
                $state.reload(); // https://jira.it.helsinki.fi/browse/OO-1004
              });
            return true;
          }
          $scope.workExperienceForm.$setDirty();
          return false;
        };
      }
    };
  })

  .directive('workExperienceSummary', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/workExperience/workExperienceSummary.html',
      scope: {},
      controller: function ($scope,
        WorkExperienceService,
        OrderWorkExperience) {
        WorkExperienceService.getWorkExperienceSubject().subscribe(function (workExperience) {
          $scope.workExperience = workExperience;
        });

        WorkExperienceService.getJobSearchSubject().subscribe(function (jobSearch) {
          $scope.jobSearch = jobSearch;
        });

        $scope.orderWorkExperience = OrderWorkExperience;
      }
    };
  });
