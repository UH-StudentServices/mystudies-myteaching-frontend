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
  'directives.favorites.addNew'
])
  .constant('availableFavoriteTypes', ['LINK', 'TWITTER'])
  .directive('favorites', function(availableFavoriteTypes,
                                   FavoritesService,
                                   NewFavoriteAddedEvent,
                                   RemoveFavoriteEvent,
                                   ComponentHeadingService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.html',
      scope: {
        favoritesData: '&',
        portfolioLang: '@',
        getHeadingOrDefault: '&'
      },
      link: function(scope) {
        var HEADING_I18N_KEY = 'favorites.title',
            COMPONENT_KEY = 'FAVORITES';

        scope.favorites = scope.favoritesData();
        scope.editMode = false;
        scope.availableFavoriteTypes = availableFavoriteTypes;
        scope.component = scope.getHeadingOrDefault({componentId: COMPONENT_KEY,
                                                     i18nKey: HEADING_I18N_KEY,
                                                     lang: scope.portfolioLang
        });
        scope.oldTitle = scope.component.heading;

        scope.edit = function() {
          scope.editMode = true;
        };

        scope.saveTitle = function() {
          if (scope.component.heading !== scope.oldTitle) {
            ComponentHeadingService.updateHeading(scope.component)
              .then(function(component) {
                if (component.heading) {
                  scope.oldTitle = component.heading;
                }
              });
            return true;
          }
          return false;
        };

        scope.exitEdit = function() {
          scope.saveTitle();
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
