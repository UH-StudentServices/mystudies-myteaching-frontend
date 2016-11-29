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
  'directives.editWorkExperience'
])

.factory('OrderWorkExperience', function() {
  return function(workExperience) {
    return workExperience.startDate.unix();
  };
})

.directive('workExperience', function(WorkExperienceService, momentDateToLocalDateArray) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      workExperienceData: '&',
      portfolioId: '@'
    },
    templateUrl: 'app/directives/workExperience/workExperience.html',
    link: function($scope) {
      $scope.editing = false;
      $scope.workExperience = WorkExperienceService.formatDates($scope.workExperienceData());
      $scope.workExperienceValid = true;

      WorkExperienceService.getJobSearchSubject().subscribe(function(jobSearch) {
        $scope.jobSearch = jobSearch;
      });

      $scope.edit = function() {
        $scope.editing = true;
      };

      $scope.refreshValidity = _.debounce(function() {
        $scope.workExperienceValid = $scope.isValid();
      }, 500);

      $scope.isValid = function() {
        return $scope.workExperience.every(function(job) {
          return job.employer &&
                 job.startDate.isValid() &&
                 (!job.endDate || job.endDate.isValid()) &&
                 job.jobTitle;
        });
      };

      $scope.exitEdit = function() {
        $scope.markAllSubmitted();

        if ($scope.jobSearch !== null) {
          WorkExperienceService.saveJobSearch($scope.jobSearch);
        } else {
          WorkExperienceService.deleteJobSearch($scope.jobSearch);
        }

        if ($scope.isValid()) {
          var updateWorkExperience = angular.copy($scope.workExperience);

          updateWorkExperience.forEach(function(job) {
            job.startDate = momentDateToLocalDateArray(job.startDate);
            job.endDate = momentDateToLocalDateArray(job.endDate);
          });

          WorkExperienceService.updateWorkExperience($scope.portfolioId, updateWorkExperience).then(function(data) {
            $scope.workExperience = data;
            $scope.editing = false;
          });
          return true;
        }
      };

      $scope.markAllSubmitted = function() {
        $scope.workExperience.forEach(function(job) { job.submitted = true; });
      };
    },
  };
})

.directive('workExperienceSummary', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directives/workExperience/workExperienceSummary.html',
    scope: {},
    controller: function($scope,
                         WorkExperienceService,
                         OrderWorkExperience) {
      WorkExperienceService.getWorkExperienceSubject().subscribe(function(workExperience) {
        $scope.workExperience = workExperience;
      });

      WorkExperienceService.getJobSearchSubject().subscribe(function(jobSearch) {
        $scope.jobSearch = jobSearch;
      });

      $scope.orderWorkExperience = OrderWorkExperience;
    }
  };
});
