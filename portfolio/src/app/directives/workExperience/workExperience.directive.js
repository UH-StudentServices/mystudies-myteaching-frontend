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

angular.module('directives.workExperience',
  ['services.workExperience',
   'filters.moment',
   'directives.dateInput'])

  .constant('AddWorkExperienceSteps', {
    SELECT_TYPE: 'selectType',
    ADD_WORK_EXPERIENCE: 'addWorkExperience',
    ADD_JOB_SEARCH: 'addJobSearch'
  })

  .constant('ResetAddWorkExperienceEvent', 'resetAddWorkExperienceEvent')

  .factory('OrderWorkExperience', function() {
    return function(workExperience) {
      return workExperience.startDate.unix();
    };
  })

  .directive('workExperience', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/workExperience/workExperience.html',
      controller: function($scope,
                           $q,
                           WorkExperienceService,
                           AddWorkExperienceSteps,
                           ResetAddWorkExperienceEvent,
                           OrderWorkExperience) {
        $scope.AddWorkExperienceSteps = AddWorkExperienceSteps;
        $scope.step = AddWorkExperienceSteps.SELECT_TYPE;

        $scope.edit = function() {
          $scope.editing = true;
        };

        $scope.exitEdit = function() {
          $scope.editing = false;
        };

        $scope.addWorkExperience = function() {
          $scope.step = AddWorkExperienceSteps.ADD_WORK_EXPERIENCE;
        };

        $scope.addJobSearch = function() {
          $scope.step = AddWorkExperienceSteps.ADD_JOB_SEARCH;
        };

        $scope.$on(ResetAddWorkExperienceEvent, function() {
          $scope.step = AddWorkExperienceSteps.SELECT_TYPE;
        });

        $scope.removeWorkExperience = function(workExperience) {
          WorkExperienceService.deleteWorkExperience(workExperience);
        };

        $scope.removeJobSearch = function() {
          WorkExperienceService.deleteJobSearch($scope.jobSearch);
        };

        $scope.orderWorkExperience = OrderWorkExperience;

        WorkExperienceService.getWorkExperienceSubject()
          .subscribe(function(workExperience) {
            $scope.workExperience = workExperience;
          });

        WorkExperienceService.getJobSearchSubject()
          .subscribe(function(jobSearch) {
            $scope.jobSearch = jobSearch;
          });
      }
    };
  })

  .directive('addWorkExperience', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/workExperience/workExperience.addNew.workExperience.html',
      scope: {
        hidePopover: '='
      },
      controller: function($scope, WorkExperienceService, ResetAddWorkExperienceEvent) {

        function createNewWorkExperience() {
          return {
            startDate: moment(),
            endDate: null
          };
        }
        $scope.newWorkExperience = createNewWorkExperience();

        $scope.addWorkExperience = function() {
          var workExperience = angular.copy($scope.newWorkExperience);

          WorkExperienceService.saveWorkExperience(workExperience).then(function() {
            $scope.newWorkExperience = createNewWorkExperience();
            $scope.hidePopover();
            $scope.$emit(ResetAddWorkExperienceEvent);
          });
        };
      }
    };

  })

  .directive('addJobSearch', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/workExperience/workExperience.addNew.jobSearch.html',
      scope: {
        hidePopover: '='
      },
      controller: function($scope, WorkExperienceService, ResetAddWorkExperienceEvent) {
        $scope.newJobSearch = {};
        $scope.addJobSearch = function() {
          WorkExperienceService.saveJobSearch($scope.newJobSearch).then(function() {
            $scope.newJobSearch = {};
            $scope.hidePopover();
            $scope.$emit(ResetAddWorkExperienceEvent);
          });
        };
      }
    };
  })

  .directive('workExperienceSummary', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/workExperience/workExperienceSummary.html',
      scope: {
      },
      controller: function($scope,
                           WorkExperienceService,
                           OrderWorkExperience) {
        WorkExperienceService.getWorkExperienceSubject()
          .subscribe(function(workExperience) {
            $scope.workExperience = workExperience;
          });

        WorkExperienceService.getJobSearchSubject()
          .subscribe(function(jobSearch) {
            $scope.jobSearch = jobSearch;
          });

        $scope.orderWorkExperience = OrderWorkExperience;
      }
    };
  });
