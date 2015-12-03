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
  'resources.favorites',
  'directives.favorites.rss',
  'directives.favorites.unicafe',
  'directives.favorites.twitter',
  'directives.favorites.addNew',
  'directives.favorites.unisport',
  'dndLists'
])
  .directive('favorites', function(FavoritesResource, newFavoriteAddedEvent, removeFavoriteEvent, AnalyticsService, disabledFavoriteTypes){
    return {
      restrict : 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope : {},
      link : function($scope) {

        $scope.editMode = false;

        $scope.edit = function() {
          $scope.editMode = true;
        };

        $scope.exitEdit = function() {
          $scope.editMode = false;
        };

        function showFavorites(favorites) {
          $scope.favorites = _.filter(favorites, function(favorite) {
            return !_.contains(disabledFavoriteTypes, favorite.type);
          });
        }

        function updateFavorites() {
          FavoritesResource.getAll().then(showFavorites);
        }

        function addFavorite(event, favoriteType) {
          AnalyticsService.trackAddFavorite(favoriteType);
          updateFavorites();
        }

        function removeFavorite(event, favoriteId, favoriteType) {
          FavoritesResource.deleteFavorite(favoriteId).then(function(favorites){
            AnalyticsService.trackRemoveFavorite(favoriteType);
            showFavorites(favorites);
          });
        }

        $scope.$on(newFavoriteAddedEvent, addFavorite);
        $scope.$on(removeFavoriteEvent, removeFavorite);

        updateFavorites();

        $scope.moved = function moved($index) {
          $scope.favorites.splice($index, 1);
          FavoritesResource.updateFavoriteOrder({
            favoriteIds: _.map($scope.favorites, function extractId(favorite) {
              return favorite.id;
            })
          });
        };
      }
    }
  });
