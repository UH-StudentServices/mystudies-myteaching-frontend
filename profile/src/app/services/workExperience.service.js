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

angular.module('services.workExperience', [
  'services.profile',
  'resources.workExperience'
])

  .factory('WorkExperienceService', function (ProfileService,
    WorkExperienceResource,
    momentDateToLocalDateArray,
    dateArrayToMomentObject) {
    var Rx = window.Rx;
    var jobSearchSubject;
    var getProfile = ProfileService.getProfile;

    function formatDates(workExperiences) {
      return _.map(workExperiences, function (job) {
        job.startDate = dateArrayToMomentObject(job.startDate);
        job.endDate = dateArrayToMomentObject(job.endDate);
        return job;
      });
    }

    function publishJobSearch(jobSearch) {
      jobSearchSubject.onNext(jobSearch);
      return jobSearch;
    }

    function getProfileId(profile) {
      return profile.id;
    }

    function getProperty(propName) {
      return _.partialRight(_.get, propName);
    }

    function getJobSearch() {
      return getProfile().then(getProperty('jobSearch'));
    }

    function saveJobSearch(jobSearch) {
      return getProfile()
        .then(getProfileId)
        .then(_.partial(WorkExperienceResource.saveJobSearch, jobSearch))
        .then(publishJobSearch);
    }

    function deleteJobSearch(jobSearch) {
      return getProfile()
        .then(getProfileId)
        .then(_.partial(WorkExperienceResource.deleteJobSearch, jobSearch))
        .then(_.partial(publishJobSearch, null));
    }

    function getJobSearchSubject() {
      if (!jobSearchSubject) {
        jobSearchSubject = new Rx.BehaviorSubject();
        getJobSearch()
          .then(publishJobSearch);
      }
      return jobSearchSubject;
    }

    function updateWorkExperience(profileId, workExperience) {
      var updatedWorkExperience = angular.copy(workExperience);

      updatedWorkExperience.forEach(function (job) {
        job.startDate = momentDateToLocalDateArray(job.startDate);
        job.endDate = momentDateToLocalDateArray(job.endDate);
      });

      return WorkExperienceResource.updateWorkExperience(profileId, updatedWorkExperience)
        .then(formatDates);
    }

    return {
      formatDates: formatDates,
      getJobSearchSubject: getJobSearchSubject,
      saveJobSearch: saveJobSearch,
      deleteJobSearch: deleteJobSearch,
      updateWorkExperience: updateWorkExperience
    };
  });
