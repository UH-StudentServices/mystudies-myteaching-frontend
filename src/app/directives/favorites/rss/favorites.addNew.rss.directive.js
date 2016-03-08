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
   'services.favorites.rss',
   'utils.validator'])

  .filter('stripHTML', function() {
    return function(input) {
      return String(input).replace(/<[^>]+>/gm, '');
    };
  })

  .constant('minSearchStringLength', 3)

  .directive('addNewRssFavorite', function(RSSService,
                                           FavoritesResource,
                                           newFavoriteAddedEvent,
                                           minSearchStringLength,
                                           ValidatorUtils) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.addNew.rss.html',
      replace: true,
      scope: true,
      link: function($scope) {
        $scope.searchString = '';
        $scope.loading = false;
        $scope.visibleItems = 3;

        function findFeedSuccess(feed) {
          if(feed && feed.title && feed.url) {
            $scope.searchResults = [feed];
          } else {
            findFeedFailed();
          }
        }

        function findFeedFailed() {
          $scope.searchResults = null;
        }


        function search(feedUrl) {
          $scope.loading = true;
          $scope.searchResults = undefined;
          RSSService.findFeed(feedUrl)
            .then(findFeedSuccess)
            .catch(findFeedFailed)
            .finally(function() {
              $scope.loading = false;
            });
        }

        function convertUrl(validFn, url) {
          var validUrl = ValidatorUtils.convertValidUrl(url);

          if(validUrl) {
            validFn(validUrl);
          }
        }

        function addFeed(feedUrl) {
          $scope.favorite.url = feedUrl;
          $scope.favorite.visibleItems = $scope.visibleItems;
          FavoritesResource.saveRSSFavorite($scope.favorite).then(function() {
            $scope.$emit(newFavoriteAddedEvent,
                $scope.favorite.type + '_' + $scope.favorite.visibleItems);
            $scope.hidePopover();
          });
        }

        $scope.search = _.debounce(_.partial(convertUrl, search), 500);

        $scope.clearSearch = function() {
          $scope.searchString = '';
        };

        $scope.addFeed = _.partial(convertUrl, addFeed);

        $scope.addFeedOnEnter = function() {
          $scope.addFeed($scope.searchString);
        };
      }
    };
  });
