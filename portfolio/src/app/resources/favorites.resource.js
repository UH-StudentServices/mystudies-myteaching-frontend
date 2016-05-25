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

angular.module('resources.favorites', ['services.state'])
  .factory('FavoritesResource', function($resource, StateService) {

    function portfolioFavoritesResource(portfolioId) {
      var portfolioFavoritesUrl = '/api/' + StateService.getCurrent() +
      '/v1/portfolio/' + portfolioId + '/favorites/:id';

      return $resource(portfolioFavoritesUrl, {id: '@id'}, {
        saveLinkFavorite: {
          method: 'POST',
          url: portfolioFavoritesUrl + '/link'
        },
        saveTwitterFavorite: {
          method: 'POST',
          url: portfolioFavoritesUrl + '/twitter'
        },
        updateFavoriteOrder: {
          method: 'POST',
          url: portfolioFavoritesUrl + '/order', isArray: true
        },
        deleteFavorite: {
          method: 'DELETE',
          url: portfolioFavoritesUrl, isArray: true
        }
      });
    }

    function getAll(portfolioId) {
      return portfolioFavoritesResource(portfolioId).query().$promise;
    }

    function saveLinkFavorite(portfolioId, linkFavorite) {
      return portfolioFavoritesResource(portfolioId).saveLinkFavorite({
        url: linkFavorite.url,
        providerName: linkFavorite.provider_name,
        title: linkFavorite.title,
        thumbnailUrl: linkFavorite.thumbnail_url,
        thumbnailWidth: linkFavorite.thumbnail_width,
        thumbnailHeight: linkFavorite.thumbnail_height
      }).$promise;
    }

    function saveTwitterFavorite(portfolioId, insertTwitterFavorite) {
      return portfolioFavoritesResource(portfolioId)
        .saveTwitterFavorite(insertTwitterFavorite).$promise;
    }

    function updateFavoriteOrder(portfolioId, favoriteIdList) {
      return portfolioFavoritesResource(portfolioId).updateFavoriteOrder(favoriteIdList).$promise;
    }

    function deleteFavorite(portfolioId, favoriteId) {
      return portfolioFavoritesResource(portfolioId).deleteFavorite({id: favoriteId}).$promise;
    }

    return {
      getAll: getAll,
      saveLinkFavorite: saveLinkFavorite,
      saveTwitterFavorite: saveTwitterFavorite,
      updateFavoriteOrder: updateFavoriteOrder,
      deleteFavorite: deleteFavorite
    };
  });