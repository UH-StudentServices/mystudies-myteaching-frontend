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

angular.module('resources.favorites.rss', [])

  .factory('RSSResource', function($resource) {

    var rssFeedResource = $resource('/api/private/v1/favorites/rss'),
        findRssFeedResource = $resource('/api/private/v1/favorites/rss/find'),
        NUMBER_OF_ITEMS = 3;


    function get(url) {
      return rssFeedResource.get({url: url, limit: NUMBER_OF_ITEMS}).$promise;
    }

    function findFeed(url) {
      return findRssFeedResource.query({url: url}).$promise;
    }

    return {
      get: get,
      findFeed: findFeed
    };
  });
