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

angular.module('directives.editWorkExperience', [
  'directives.dateInput',
  'services.visibility'
])

  .directive('editWorkExperience', function (WorkExperienceService, Visibility) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/workExperience/editWorkExperience.html',
      link: function ($scope) {
        $scope.startDateChanged = function (job) {
          if (!job.startDate || !job.startDate.isValid()) {
            job.startDate = moment();
          }
          $scope.refreshValidity();
        };

        $scope.endDateChanged = function (job) {
          if (job.endDate && !job.endDate.isValid()) {
            job.endDate = '';
          }
          $scope.refreshValidity();
        };

        $scope.addWorkExperience = function (job) {
          job.id = Date.now();
          job.startDate = moment();
          job.endDate = '';
          job.jobTitle = '';
          job.employerUrl = '';
          job.visibility = Visibility.PUBLIC;
          $scope.workExperience.push(job);
          $scope.newJob = {};
          $scope.refreshValidity();
        };

        $scope.removeWorkExperience = function (job) {
          $scope.workExperience = _.without($scope.workExperience, job);
          $scope.refreshValidity(); // we might have deleted the only invalid item
        };

        $scope.addJobSearch = function (jobSearch) {
          $scope.jobSearch = jobSearch;
          $scope.newJobSearch = {};
        };

        $scope.removeJobSearch = function () {
          $scope.jobSearch = null;
        };

        $scope.sortableOptions = { containment: '.work-experience__dropzone' };
      }
    };
  });
