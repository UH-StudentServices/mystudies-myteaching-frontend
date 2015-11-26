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

angular.module('resources.usefulLinks', [])

  .factory('UsefulLinksResource', function UsefulLinksResource($resource) {
    var usefulLinksResource = $resource('/api/private/v1/usefullinks/:id', {id: '@id'}, {
      update: {method: 'PUT'},
      delete : {method: 'DELETE', isArray : true},
      updateOrder: {method: 'POST', url : '/api/private/v1/usefullinks/order'}
    });
    var searchPageTitleResource = $resource('/api/private/v1/usefullinks/searchpagetitle', null, {
      searchPageTitle : {method: 'POST'}
    });

    function getAll() {
      return usefulLinksResource.query().$promise;
    }

    function save(usefulLink) {
      return usefulLinksResource.save(usefulLink).$promise;
    }

    function update(usefulLink) {
      return usefulLinksResource.update(usefulLink).$promise;
    }

    function deleteLink(usefulLink) {
      return usefulLinksResource.delete(usefulLink).$promise;
    }

    function searchPageTitle(url) {
      return searchPageTitleResource.searchPageTitle({searchUrl: url}).$promise;
    }

    function updateOrder(usefulLinksIds) {
      return usefulLinksResource.updateOrder({usefulLinkIds : usefulLinksIds})
    }

    return {
      getAll: getAll,
      save: save,
      update: update,
      deleteLink: deleteLink,
      searchPageTitle: searchPageTitle,
      updateOrder : updateOrder
    }
  });