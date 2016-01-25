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

angular.module('resources.search', [])

  .factory('SearchResource', function SearchResource($resource) {
    var searchResource = $resource('/api/private/v1/search?searchTerm=:searchTerm', {}, {
      search: {
        method: 'GET',
        isArray: true
      },
      searchCategory: {
        url: '/api/private/v1/search/category?searchTerm=:searchTerm',
        method: 'GET',
        isArray: true
      }
    });

    function search(searchTerm) {
      return searchResource.search({searchTerm: searchTerm}).$promise;
    }

    function searchCategory(searchTerm) {
      return searchResource.searchCategory({searchTerm: searchTerm}).$promise;
    }

    return {
      search: search,
      searchCategory: searchCategory
    };
  });
