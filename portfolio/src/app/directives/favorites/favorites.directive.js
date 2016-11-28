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

angular.module('directives.favorites', [
  'directives.removeFavorite',
  'services.favorites',
  'directives.favorites.link',
  'directives.favorites.twitter',
  'directives.favorites.addNew',
  'dndLists'
])
  .directive('favorites', function(FavoritesService, newFavoriteAddedEvent, removeFavoriteEvent) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope: {
        favoritesData: '&'
      },
      link: function($scope) {
        $scope.favorites = $scope.favoritesData();
        $scope.editMode = false;

        $scope.edit = function() {
          $scope.editMode = true;
        };

        $scope.exitEdit = function() {
          $scope.editMode = false;
          return true;
        };

        function updateFavorites() {
          FavoritesService.getFavorites().then(function(favorites) {
            $scope.favorites = favorites;
          });
        }

        function removeFavorite(event, favoriteId) {
          FavoritesService.deleteFavorite(favoriteId).then(function(favorites) {
            $scope.favorites = favorites;
          });
        }

        $scope.$on(newFavoriteAddedEvent, updateFavorites);
        $scope.$on(removeFavoriteEvent, removeFavorite);

        $scope.moved = function moved($index) {
          $scope.favorites.splice($index, 1);
          FavoritesService.updateFavoriteOrder({
            favoriteIds: _.map($scope.favorites, function extractId(favorite) {
              return favorite.id;
            })
          });
        };
      }
    };
  });
