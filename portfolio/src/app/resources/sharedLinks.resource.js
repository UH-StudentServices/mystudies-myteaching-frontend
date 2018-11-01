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

angular.module('resources.sharedLink', [])
  .factory('SharedLinksResource', function ($resource) {
    function SharedLinksResource(portfolioId) {
      return $resource('/api/private/v1/:portfolioId/sharelinks', { portfolioId: portfolioId }, {
        create: { method: 'POST', isArray: false },
        save: { method: 'PATCH', isArray: false },
        get: { method: 'GET', isArray: true }
      });
    }

    function create(portfolioId, shareLink) {
      return SharedLinksResource(portfolioId).create(shareLink).$promise;
    }

    function save(portfolioId, shareLinkChange) {
      return SharedLinksResource(portfolioId).save(shareLinkChange).$promise;
    }

    function get(portfolioId) {
      return SharedLinksResource(portfolioId).get().$promise;
    }

    return {
      create: create,
      save: save,
      get: get
    };
  });
