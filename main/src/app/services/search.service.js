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

angular.module('services.search', [
  'resources.search'
])
  .factory('SearchService', function SearchService(SearchResource, dateArrayToMomentObject) {

    function search(searchTerm) {
      return SearchResource.search(searchTerm).then(function(data) {
        return _.map(data, function(item) {
          item.date = dateArrayToMomentObject(item.date).format('DD.MM.YYYY');
          return item;
        });
      });
    }

    function searchCategory(searchTerm) {
      return SearchResource.searchCategory(searchTerm).then(function(data) {
        return _.pluck(data, 'title');
      });
    }

    return {
      search: search,
      searchCategory: searchCategory
    };

  });
