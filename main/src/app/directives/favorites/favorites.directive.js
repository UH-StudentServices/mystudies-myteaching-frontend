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

angular.module('directives.favorites', [
  'directives.removeFavorite',
  'resources.favorites',
  'directives.favorites.rss',
  'directives.favorites.unicafe',
  'directives.favorites.twitter',
  'directives.favorites.addNew',
  'directives.favorites.flamma'
])
  .constant('availableFavoriteTypes', ['RSS', 'UNICAFE', 'TWITTER', 'FLAMMA_NEWS', 'FLAMMA_EVENTS'])
  .directive('favorites', function (availableFavoriteTypes,
    FavoritesService,
    NewFavoriteAddedEvent,
    RemoveFavoriteEvent) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope: {},
      link: function ($scope) {
        $scope.editMode = false;
        $scope.availableFavoriteTypes = availableFavoriteTypes;

        $scope.edit = function () {
          $scope.editMode = true;
        };

        $scope.exitEdit = function () {
          $scope.editMode = false;
          return true;
        };

        function showFavorites(favorites) {
          $scope.favorites = favorites;
        }

        function updateFavorites() {
          FavoritesService.getFavorites().then(showFavorites);
        }

        function removeFavorite(event, favoriteId, favoriteType) {
          FavoritesService.deleteFavorite(favoriteId, favoriteType).then(function (favorites) {
            showFavorites(favorites);
          });
        }

        $scope.$on(NewFavoriteAddedEvent, updateFavorites);
        $scope.$on(RemoveFavoriteEvent, removeFavorite);

        updateFavorites();

        $scope.sortableOptions = {
          containment: '.favorites__dropzone',
          orderChanged: function () {
            FavoritesService.updateFavoriteOrder({
              favoriteIds: $scope.favorites.map(function (favorite) {
                return favorite.id;
              })
            });
          }
        };
      }
    };
  });
