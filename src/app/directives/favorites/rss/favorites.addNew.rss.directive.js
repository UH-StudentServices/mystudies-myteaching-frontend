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

angular.module('directives.favorites.addNew.rss',
  ['resources.favorites',
   'services.favorites.rss'])

  .filter('stripHTML', function() {
    return function(input) {
      return String(input).replace(/<[^>]+>/gm, '');
    };
  })

  .constant('minSearchStringLength', 3)

  .directive('addNewRssFavorite', function(RSSService, FavoritesResource,
                                           newFavoriteAddedEvent, minSearchStringLength) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.addNew.rss.html',
      replace: true,
      scope: true,
      link: function($scope) {
        $scope.searchString = '';
        $scope.loading = false;
        $scope.visibleItems = 3;

        function searchWithUrl(searchUrl) {
          return RSSService.getFeedTitle(searchUrl)
            .then(function(title) {
              if(title) {
                return [{title: title, url: searchUrl}];
              } else {
                return null;
              }
            });
        }

        function search(feedUrl) {
          $scope.loading = true;
          $scope.searchResults = undefined;
          searchWithUrl(feedUrl)
            .then(function(searchResults) {
              $scope.searchResults = searchResults;
            })
            .finally(function() {
              $scope.loading = false;
            });
        }

        $scope.search = _.debounce(search, 500);

        $scope.clearSearch = function() {
          $scope.searchString = '';
        };

        $scope.addFeed = function(feedUrl) {
          $scope.favorite.url = feedUrl;
          $scope.favorite.visibleItems = $scope.visibleItems;
          FavoritesResource.saveRSSFavorite($scope.favorite).then(function() {
            $scope.$emit(newFavoriteAddedEvent,
              $scope.favorite.type + '_' + $scope.favorite.visibleItems);
            $scope.hidePopover();
          });
        };

        $scope.addFeedOnEnter = function() {
          $scope.addFeed($scope.searchString);
        };
      }
    };
  });
