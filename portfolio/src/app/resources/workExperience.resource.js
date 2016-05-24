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

angular.module('resources.workExperience', ['services.state'])

  .factory('WorkExperienceResource', function($resource, StateService) {

    function workExperienceResource(portfolioId) {
      return $resource('/api/' + StateService.getCurrent() + '/v1/portfolio/' +
        portfolioId + '/workexperience/:id', {id: '@id'},
        {'delete': {method: 'DELETE', isArray: true}});
    }

    function jobSearchResource(portfolioId) {
      return $resource('/api/' + StateService.getCurrent() + '/v1/portfolio/' +
        portfolioId + '/jobsearch/:id', {id: '@id'});
    }

    function saveWorkExperience(workExperience, portfolioId) {
      return workExperienceResource(portfolioId).save(workExperience).$promise;
    }

    function saveJobSearch(jobSearch, portfolioId) {
      return jobSearchResource(portfolioId).save(jobSearch).$promise;
    }

    function deleteWorkExperience(workExperienceId, portfolioId) {
      return workExperienceResource(portfolioId).delete({id: workExperienceId}).$promise;
    }

    function deleteJobSearch(jobSearch, portfolioId) {
      return jobSearchResource(portfolioId).delete(jobSearch).$promise;
    }

    return {
      saveWorkExperience: saveWorkExperience,
      saveJobSearch: saveJobSearch,
      deleteWorkExperience: deleteWorkExperience,
      deleteJobSearch: deleteJobSearch
    };
  });
