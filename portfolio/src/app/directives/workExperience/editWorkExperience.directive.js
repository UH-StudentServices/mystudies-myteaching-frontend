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

angular.module('directives.editWorkExperience', [
  'directives.dateInput'
])

.directive('editWorkExperience', function($translate) {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/workExperience/editWorkExperience.html',
    link: function($scope) {

      $scope.editEmployer = function(job) {
        job.employerEdit = true;
      };

      $scope.exitEmployerEdit = function(job) {
        job.employerEdit = false;
      };

      $scope.editStartDate = function(job) {
        job.startDateEdit = true;
      };

      $scope.exitStartDateEdit = function(job) {
        if (!job.startDate.isValid()) {
          job.startDate = moment();
        }
        job.startDateEdit = false;
      };

      $scope.editEndDate = function(job) {
        job.endDateEdit = true;
      };

      $scope.exitEndDateEdit = function(job) {
        if (!job.endDate.isValid()) {
          job.endDate = '';
        }
        job.endDateEdit = false;
      };

      $scope.editJobTitle = function(job) {
        job.jobTitleEdit = true;
      };

      $scope.exitJobTitleEdit = function(job) {
        job.jobTitleEdit = false;
      };

      $scope.editDescription = function(job) {
        job.descriptionEdit = true;
      };

      $scope.exitDescriptionEdit = function(job) {
        job.descriptionEdit = false;
      };

      $scope.editEmployerUrl = function(job) {
        job.employerUrlEdit = true;
      };

      $scope.exitEmployerUrlEdit = function(job) {
        job.employerUrlEdit = false;
      };

      $scope.addWorkExperience = function(job) {
        job.startDate = moment();
        job.jobTitle = $translate.instant('workExperience.jobTitle');
        job.employerUrl = $translate.instant('workExperience.employerUrl');
        $scope.workExperience.push(job);
        $scope.newJob = {};
      };

      $scope.removeWorkExperience = function(job) {
        $scope.workExperience = _.without($scope.workExperience, job);
      };

      $scope.addJobSearch = function(jobSearch) {
        if (jobSearch) {
          jobSearch.headline = $translate.instant('workExperience.jobSearchHeadline');
          $scope.jobSearch = jobSearch;
          $scope.newJobSearch = {};
        }
      };

      $scope.removeJobSearch = function() {
        $scope.jobSearch = null;
      };

    }
  };
});
