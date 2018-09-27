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
  'directives.editableHeading',
  'portfolioAnalytics'
])
  .constant('availableFavoriteTypes', ['LINK', 'TWITTER'])
  .directive('favorites', function(availableFavoriteTypes,
                                   FavoritesService,
                                   NewFavoriteAddedEvent,
                                   RemoveFavoriteEvent,
                                   StartFetchingFavoriteEvent,
                                   FinishFetchingFavoriteEvent,
                                   $state,
                                   AnalyticsService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope: {
        favoritesData: '&',
        portfolioLang: '@'
      },
      link: function(scope) {
        scope.favorites = scope.favoritesData();
        scope.editing = false;
        scope.availableFavoriteTypes = availableFavoriteTypes;
        scope.loading = false;

        scope.edit = function() {
          scope.editing = true;
        };

        scope.exitEdit = function() {
          scope.$broadcast('saveComponent');
          FavoritesService.getFavorites().then(function(favorites) {
            scope.favorites = favorites;
            $state.reload();
          });
          scope.editing = false;
          return true;
        };

        function showFavorites(favorites) {
          scope.favorites = favorites;
        }

        function favoriteAdded() {
          AnalyticsService.trackEvent(AnalyticsService.ec.FAVORITES, AnalyticsService.ea.ADD);
          updateFavorites();
        }

        function updateFavorites() {
          FavoritesService.getFavorites().then(showFavorites);
        }

        function removeFavorite(event, favoriteId) {
          FavoritesService.deleteFavorite(favoriteId).then(showFavorites);
        }

        function startLoading() {
          scope.loading = true;
        }

        function finishLoading() {
          scope.loading = false;
        }

        scope.$on(NewFavoriteAddedEvent, favoriteAdded);
        scope.$on(RemoveFavoriteEvent, removeFavorite);
        scope.$on(StartFetchingFavoriteEvent, startLoading);
        scope.$on(FinishFetchingFavoriteEvent, finishLoading);

        scope.sortableOptions = {
          containment: '.favorites__dropzone',
          orderChanged: function() {
            FavoritesService.updateFavoriteOrder({
              favoriteIds: scope.favorites.map(function(favorite) {
                return favorite.id;
              })
            });
          },
          accept: function(sourceItemHandleScope, destSortableScope) {
            return sourceItemHandleScope.itemScope.sortableScope.$parent.$id === destSortableScope.$parent.$id;
          }
        };
      }
    };
  });
