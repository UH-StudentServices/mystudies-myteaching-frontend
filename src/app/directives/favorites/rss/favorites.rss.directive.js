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
  'resources.favorites.rss',
  'resources.metaData',
  'filters.moment'])

  .directive('favoritesRss', function(RSSResource, MetaDataResource) {
    return {
      restrict : 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.rss.html',
      replace: true,
      scope : {
        data : '='
      },
      link : function($scope) {
        RSSResource.get($scope.data.url, $scope.data.visibleItems).then(function(feedData) {
          if(feedData.data.responseData) {
            $scope.feedTitle = feedData.data.responseData.feed.title;
            $scope.feedDateLocalized = moment(new Date(feedData.data.responseData.feed.entries[0].publishedDate)).format('l');
            $scope.feedLink = feedData.data.responseData.feed.link;
            if($scope.data.visibleItems === 1) {
              MetaDataResource.getMetaData(feedData.data.responseData.feed.entries[0].link).then(
                function getPageMetaDataSuccess(metaData) {
                  $scope.singleFeedItem = feedData.data.responseData.feed.entries[0];
                  $scope.metaData = metaData;                  
                });
            } else {
              $scope.feed = feedData.data.responseData.feed;
            }
          }
        });

        $scope.getFeedClasses = function getFeedClasses(){
          return {
            'single': !_.isUndefined($scope.singleFeedItem)
          };
        }

        $scope.getSingleItemStyle = function getSingleItemStyle() {
          return {
            background: 'url(' + $scope.metaData.image + ') no-repeat center center'
          };
        }
      }
    }
  });