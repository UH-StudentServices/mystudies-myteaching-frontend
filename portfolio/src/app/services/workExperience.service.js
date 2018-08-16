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

angular.module('services.workExperience', [
  'services.portfolio',
  'resources.workExperience'])

  .factory('WorkExperienceService', function(PortfolioService,
                                             WorkExperienceResource,
                                             momentDateToLocalDateArray,
                                             dateArrayToMomentObject,
                                             $filter) {

    var Rx = window.Rx,
        workExperienceSubject,
        jobSearchSubject,
        orderBy = $filter('orderBy'),
        getPortfolio = PortfolioService.getPortfolio;

    function formatDates(workExperiences) {
      workExperiences = _.map(workExperiences, function(job) {
        job.startDate = dateArrayToMomentObject(job.startDate);
        job.endDate = dateArrayToMomentObject(job.endDate);
        return job;
      });
      return orderBy(workExperiences, '-startDate');
    }

    function workExperienceArrayDatesToMoment(workExperience) {
      if (workExperience) {
        workExperience.startDate = dateArrayToMomentObject(workExperience.startDate);
        workExperience.endDate = dateArrayToMomentObject(workExperience.endDate);
      }
      return workExperience;
    }

    function publishWorkExperience(workExperience) {
      workExperienceSubject.onNext(workExperience);
      return workExperience;
    }

    function publishJobSearch(jobSearch) {
      jobSearchSubject.onNext(jobSearch);
      return jobSearch;
    }

    function getPortfolioId(portfolio) {
      return portfolio.id;
    }

    function getProperty(propName) {
      return _.partialRight(_.get, propName);
    }

    function getJobSearch() {
      return getPortfolio().then(getProperty('jobSearch'));
    }

    function getWorkExperience() {
      return getPortfolio()
        .then(getProperty('workExperience'))
        .then(_.partialRight(_.map, workExperienceArrayDatesToMoment));
    }

    function saveJobSearch(jobSearch) {
      return getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.saveJobSearch, jobSearch))
        .then(publishJobSearch);
    }

    function deleteJobSearch(jobSearch) {
      return getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.deleteJobSearch, jobSearch))
        .then(_.partial(publishJobSearch, null));
    }

    function getWorkExperienceSubject() {
      if (!workExperienceSubject) {
        workExperienceSubject = new Rx.BehaviorSubject();
        getWorkExperience()
          .then(publishWorkExperience);
      }
      return workExperienceSubject;
    }

    function getJobSearchSubject() {
      if (!jobSearchSubject) {
        jobSearchSubject = new Rx.BehaviorSubject();
        getJobSearch()
          .then(publishJobSearch);
      }
      return jobSearchSubject;
    }

    function updateWorkExperience(portfolioId, workExperience) {
      var updateWorkExperience = angular.copy(workExperience);

      updateWorkExperience.forEach(function(job) {
        job.startDate = momentDateToLocalDateArray(job.startDate);
        job.endDate = momentDateToLocalDateArray(job.endDate);
      });

      return WorkExperienceResource.updateWorkExperience(portfolioId, updateWorkExperience).then(formatDates);
    }

    function updateWorkExperienceOrder(workIdList) {
      return getPortfolio().then(function(portfolio) {
        return WorkExperienceResource.updateWorkExperienceOrder(portfolio.id, workIdList);
      });
    }

    return {
      formatDates: formatDates,
      getWorkExperienceSubject: getWorkExperienceSubject,
      getJobSearchSubject: getJobSearchSubject,
      saveJobSearch: saveJobSearch,
      deleteJobSearch: deleteJobSearch,
      updateWorkExperience: updateWorkExperience,
      updateWorkExperienceOrder: updateWorkExperienceOrder
    };
  });

