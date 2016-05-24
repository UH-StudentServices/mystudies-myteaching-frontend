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
                                             dateArrayToMomentObject,
                                             momentDateToLocalDateArray) {

    var Rx = window.Rx,
        workExperienceSubject,
        jobSearchSubject;

    function workExperienceArrayDatesToMoment(workExperience) {
      if(workExperience) {
        workExperience.startDate = dateArrayToMomentObject(workExperience.startDate);
        workExperience.endDate = dateArrayToMomentObject(workExperience.endDate);
      }

      return workExperience;
    }

    function workExperienceMomentsToArrays(workExperience) {
      workExperience.startDate = momentDateToLocalDateArray(workExperience.startDate);
      workExperience.endDate = momentDateToLocalDateArray(workExperience.endDate);
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
      return PortfolioService.getPortfolio()
          .then(getProperty('jobSearch'));
    }

    function getWorkExperience() {
      return PortfolioService.getPortfolio()
        .then(getProperty('workExperience'))
        .then(_.partialRight(_.map, workExperienceArrayDatesToMoment));
    }

    function addToWorkExperience(newItem) {
      return workExperienceSubject.getValue().concat(newItem);
    }

    function saveWorkExperience(workExperience) {
      return PortfolioService.getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.saveWorkExperience,
              workExperienceMomentsToArrays(workExperience)))
        .then(workExperienceArrayDatesToMoment)
        .then(addToWorkExperience)
        .then(publishWorkExperience);
    }

    function saveJobSearch(jobSearch) {
      return PortfolioService.getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.saveJobSearch, jobSearch))
        .then(publishJobSearch);
    }

    function deleteWorkExperience(workExperience) {
      return PortfolioService.getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.deleteWorkExperience, workExperience.id))
        .then(_.partialRight(_.map, workExperienceArrayDatesToMoment))
        .then(publishWorkExperience);
    }

    function deleteJobSearch(jobSearch) {
      return PortfolioService.getPortfolio()
        .then(getPortfolioId)
        .then(_.partial(WorkExperienceResource.deleteJobSearch, jobSearch))
        .then(_.partial(publishJobSearch, null));
    }

    function getWorkExperienceSubject() {
      if(!workExperienceSubject) {
        workExperienceSubject = new Rx.BehaviorSubject();
        getWorkExperience()
          .then(publishWorkExperience);
      }

      return workExperienceSubject;
    }

    function getJobSearchSubject() {
      if(!jobSearchSubject) {
        jobSearchSubject = new Rx.BehaviorSubject();
        getJobSearch()
          .then(publishJobSearch);
      }

      return jobSearchSubject;
    }

    return {
      getWorkExperienceSubject: getWorkExperienceSubject,
      getJobSearchSubject: getJobSearchSubject,
      saveJobSearch: saveJobSearch,
      saveWorkExperience: saveWorkExperience,
      deleteWorkExperience: deleteWorkExperience,
      deleteJobSearch: deleteJobSearch
    };
  });

