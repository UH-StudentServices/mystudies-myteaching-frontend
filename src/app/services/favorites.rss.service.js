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

angular.module('services.favorites.rss', ['resources.favorites.rss', 'utils.moment'])

  .factory('RSSService', function(RSSResource, dateArrayToMomentObject) {

    function get(feedUrl, numberOfItems) {

      function convertDate(d) {
        return dateArrayToMomentObject(_.slice(d, 0, 5));
      }

      return RSSResource.get(feedUrl, numberOfItems).then(function(feed) {
        feed.momentDate = convertDate(feed.date);
        _.each(feed.entries, function(entry) {
          entry.momentDate = convertDate(feed.date);
        });
        return feed;
      });
    }

    function getFeedTitle(feedUrl) {
      return RSSResource.get(feedUrl, 1).then(function(feed) {
        return feed.title;
      });
    }

    return {
      get: get,
      getFeedTitle: getFeedTitle
    };

  });
