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
  .constant('availableFavoriteTypes', ['LINK', 'TWITTER'])
  .directive('favorites', function(availableFavoriteTypes,
                                   FavoritesService,
                                   NewFavoriteAddedEvent,
                                   RemoveFavoriteEvent) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope: {
        favoritesData: '&'
      },
      link: function(scope) {
        scope.favorites = scope.favoritesData();
        scope.editMode = false;
        scope.availableFavoriteTypes = availableFavoriteTypes;

        scope.edit = function() {
          scope.editMode = true;
        };

        scope.exitEdit = function() {
          scope.editMode = false;
          return true;
        };

        function showFavorites(favorites) {
          scope.favorites = favorites;
        }

        function updateFavorites() {
          FavoritesService.getFavorites().then(showFavorites);
        }

        function removeFavorite(event, favoriteId) {
          FavoritesService.deleteFavorite(favoriteId).then(showFavorites);
        }

        scope.$on(NewFavoriteAddedEvent, updateFavorites);
        scope.$on(RemoveFavoriteEvent, removeFavorite);

        scope.moved = function moved($index) {
          scope.favorites.splice($index, 1);
          FavoritesService.updateFavoriteOrder({
            favoriteIds: _.map(scope.favorites, function extractId(favorite) {
              return favorite.id;
            })
          });
        };
      }
    };
  });
