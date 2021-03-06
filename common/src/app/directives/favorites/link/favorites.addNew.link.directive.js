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

angular.module('directives.favorites.addNew.link', [
  'services.favorites',
  'resources.favorites.link',
  'directives.favorites.addNew'
])
  .constant('StartFetchingFavoriteEvent', 'START_FETCHING_FAVORITE')
  .constant('FinishFetchingFavoriteEvent', 'FINISH_FETCHING_FAVORITE')

  .directive('addNewLinkFavorite', function (EmbedLyResource,
    FavoritesService,
    NewFavoriteAddedEvent,
    StartFetchingFavoriteEvent,
    FinishFetchingFavoriteEvent) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/link/favorites.addNew.link.html',
      replace: true,
      scope: true,
      link: function ($scope) {
        $scope.searchString = '';
        $scope.loading = false;

        function search(searchString) {
          $scope.loading = true;
          $scope.$emit(StartFetchingFavoriteEvent);
          EmbedLyResource.get(searchString).then(function getMetaDataSuccess(result) {
            $scope.metaData = result.data;
          }).finally(function getMetaDataFinally() {
            $scope.$emit(FinishFetchingFavoriteEvent);
            $scope.loading = false;
          });
        }

        $scope.search = search;

        $scope.clearSearch = function () {
          $scope.$emit(FinishFetchingFavoriteEvent);
          $scope.metaData = undefined;
        };

        $scope.addLinkFavorite = function addLinkFavorite() {
          if (!_.isUndefined($scope.metaData)) {
            FavoritesService.saveLinkFavorite($scope.metaData, $scope.favorite.type)
              .then(function saveLinkSuccess() {
                $scope.$emit(NewFavoriteAddedEvent);
                $scope.closePopover();
              });
          }
        };
      }
    };
  });
