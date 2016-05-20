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

angular.module('resources.favorites', [])
  .factory('FavoritesResource', function($resource) {
    var favoritesResource = $resource('/api/private/v1/favorites', {'id': '@id'}, {
      saveRSSFavorite: {method: 'POST', url: '/api/private/v1/favorites/rss'},
      saveLinkFavorite: {method: 'POST', url: '/api/private/v1/favorites/link'},
      saveUnicafeFavorite: {method: 'POST', url: '/api/private/v1/favorites/unicafe'},
      updateUnicafeFavorite: {method: 'PUT', url: '/api/private/v1/favorites/unicafe/:id'},
      saveUnisportFavorite: {method: 'POST', url: '/api/private/v1/favorites/unisport'},
      saveTwitterFavorite: {method: 'POST', url: '/api/private/v1/favorites/twitter'},
      updateFavoriteOrder: {method: 'POST', url: '/api/private/v1/favorites/order', isArray: true},
      deleteFavorite: {method: 'DELETE', url: '/api/private/v1/favorites/:id', isArray: true}
    });

    function getAll() {
      return favoritesResource.query().$promise;
    }

    function saveRSSFavorite(rssFavorite) {
      return favoritesResource.saveRSSFavorite(rssFavorite).$promise;
    }

    function saveLinkFavorite(linkFavorite) {
      return favoritesResource.saveLinkFavorite({
        url: linkFavorite.url,
        providerName: linkFavorite.provider_name,
        title: linkFavorite.title,
        thumbnailUrl: linkFavorite.thumbnail_url,
        thumbnailWidth: linkFavorite.thumbnail_width,
        thumbnailHeight: linkFavorite.thumbnail_height
      }).$promise;
    }

    function saveUnicafeFavorite(unicafeFavoriteRequest) {
      return favoritesResource.saveUnicafeFavorite(unicafeFavoriteRequest).$promise;
    }

    function updateUnicafeFavorite(unicafeFavoriteRequest) {
      return favoritesResource.updateUnicafeFavorite(unicafeFavoriteRequest).$promise;
    }

    function saveUnisportFavorite() {
      return favoritesResource.saveUnisportFavorite().$promise;
    }

    function saveTwitterFavorite(insertTwitterFavoriteRequest) {
      return favoritesResource.saveTwitterFavorite(insertTwitterFavoriteRequest).$promise;
    }

    function updateFavoriteOrder(favoriteIdList) {
      return favoritesResource.updateFavoriteOrder(favoriteIdList).$promise;
    }

    function deleteFavorite(favoriteId) {
      return favoritesResource.deleteFavorite({id: favoriteId}).$promise;
    }

    return {
      getAll: getAll,
      saveRSSFavorite: saveRSSFavorite,
      saveUnisportFavorite: saveUnisportFavorite,
      saveLinkFavorite: saveLinkFavorite,
      saveUnicafeFavorite: saveUnicafeFavorite,
      updateUnicafeFavorite: updateUnicafeFavorite,
      saveTwitterFavorite: saveTwitterFavorite,
      updateFavoriteOrder: updateFavoriteOrder,
      deleteFavorite: deleteFavorite
    };
  });
