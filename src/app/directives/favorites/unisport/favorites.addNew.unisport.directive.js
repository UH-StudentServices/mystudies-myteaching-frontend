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

angular.module('directives.favorites.addNew.unisport',
  ['resources.favorites',])

  .directive('addNewUnisportFavorite', function(FavoritesResource, newFavoriteAddedEvent) {
    return {
      restrict: 'E',
      scope: true,
      link: function($scope) {
        FavoritesResource.getAll().then(function getAllSuccess(allFavorites) {
          if(_.isUndefined(_.find(allFavorites, function(favorite) {
            return favorite.type === 'UNISPORT'
          }))) {
            return FavoritesResource.saveUnisportFavorite();
          }
        }).finally(function addNewUnisportFavoriteFinally(){
          $scope.$emit(newFavoriteAddedEvent, $scope.favorite.type);
          $scope.hidePopover();
        });
      }
    }
  });