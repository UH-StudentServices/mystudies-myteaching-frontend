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

angular.module('directives.favorites.addNew.rss', [
  'services.favorites',
  'utils.validator',
  'directives.favorites.addNew'
])

  .filter('stripHTML', function () {
    return function (input) {
      return String(input).replace(/<[^>]+>/gm, '');
    };
  })

  .constant('minSearchStringLength', 3)

  .directive('addNewRssFavorite', function (FavoritesService,
    NewFavoriteAddedEvent,
    minSearchStringLength,
    ValidatorUtils) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.addNew.rss.html',
      replace: true,
      scope: true,
      link: function ($scope) {
        $scope.searchString = '';
        $scope.loading = false;

        function findFeedFailed() {
          $scope.searchResults = null;
        }

        function findFeedSuccess(feed) {
          if (feed) {
            $scope.searchResults = feed;
          } else {
            findFeedFailed();
          }
        }

        function search(feedUrl) {
          $scope.loading = true;
          $scope.searchResults = undefined;
          FavoritesService.findRSSFeed(feedUrl)
            .then(findFeedSuccess)
            .catch(findFeedFailed)
            .finally(function () {
              $scope.loading = false;
            });
        }

        function convertUrl(validFn, url) {
          var validUrl = ValidatorUtils.convertValidUrl(url);

          if (validUrl) {
            validFn(validUrl);
          }
        }

        function addFeed(feedUrl) {
          $scope.favorite.url = feedUrl;
          FavoritesService.saveRSSFavorite($scope.favorite, $scope.favorite.type)
            .then(function () {
              $scope.$emit(NewFavoriteAddedEvent);
            });
        }

        $scope.search = _.debounce(_.partial(convertUrl, search), 500);

        $scope.clearSearch = function () {
          $scope.searchString = '';
        };

        $scope.addFeed = _.partial(convertUrl, addFeed);

        $scope.addFeedOnEnter = function () {
          var urlToAdd = _.get($scope, ['searchResults', '0', 'url']);

          if (urlToAdd) {
            $scope.addFeed(urlToAdd);
          }
        };
      }
    };
  });
