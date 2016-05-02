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

angular.module('directives.favorites.rss',[
  'services.favorites.rss',
  'resources.metaData',
  'filters.moment'])

  .directive('favoritesRss', function(RSSService, MetaDataResource) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.rss.html',
      replace: true,
      scope: {
        data: '='
      },
      link: function($scope) {

        var feedUrl = $scope.data.url;

        RSSService.get(feedUrl).then(function getFeedSuccess(feedData) {

          $scope.feedTitle = feedData.title ? feedData.title : feedUrl;
          $scope.feedDateLocalized = feedData.momentDate.format('l');
          $scope.feedLink = feedData.link;

          $scope.feed = feedData;
        });
      }
    };
  });
