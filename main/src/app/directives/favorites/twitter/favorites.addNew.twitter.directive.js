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

angular.module('directives.favorites.addNew.twitter',
  ['resources.favorites'])

  .constant('twitterFeedTypes', {
    USER_TIMELINE: 'USER_TIMELINE'
  })

  .directive('addNewTwitterFavorite', function(FavoritesResource, twitterFeedTypes,
                                               newFavoriteAddedEvent) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/twitter/favorites.addNew.twitter.html',
      replace: true,
      scope: true,
      controller: function($scope) {
        $scope.addTwitterFavorite = function() {
          var insertTwitterFavoriteRequest = {};

          insertTwitterFavoriteRequest.feedType = twitterFeedTypes.USER_TIMELINE;
          insertTwitterFavoriteRequest.value = $scope.twitterUsername;

          FavoritesResource.saveTwitterFavorite(insertTwitterFavoriteRequest).then(function() {
            $scope.$emit(newFavoriteAddedEvent,
              $scope.favorite.type + '_' + twitterFeedTypes.USER_TIMELINE);
          });
        };
      }
    };
  });
