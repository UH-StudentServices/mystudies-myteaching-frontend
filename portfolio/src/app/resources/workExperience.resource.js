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

  .factory('WorkExperienceResource', function ($resource, StateService) {
    function workExperienceResource(portfolioId) {
      var workExperienceUrl = '/api/' + StateService.getCurrent() + '/v1/profile/'
        + portfolioId + '/workexperience/:id';

      return $resource(workExperienceUrl, { id: '@id' },
        {
          delete: { url: workExperienceUrl, method: 'DELETE', isArray: true },
          update: { url: workExperienceUrl, method: 'POST', isArray: true }
        });
    }

    function jobSearchResource(portfolioId) {
      return $resource('/api/' + StateService.getCurrent() + '/v1/profile/'
        + portfolioId + '/jobsearch', {});
    }

    function saveJobSearch(jobSearch, portfolioId) {
      return jobSearchResource(portfolioId).save(jobSearch).$promise;
    }

    function deleteJobSearch(jobSearch, portfolioId) {
      return jobSearchResource(portfolioId).delete(jobSearch).$promise;
    }

    function updateWorkExperience(portfolioId, updatedWorkExperience) {
      return workExperienceResource(portfolioId).update(updatedWorkExperience).$promise;
    }

    return {
      saveJobSearch: saveJobSearch,
      deleteJobSearch: deleteJobSearch,
      updateWorkExperience: updateWorkExperience
    };
  });
