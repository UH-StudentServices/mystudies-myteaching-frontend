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

angular.module('services.favorites', ['services.portfolio', 'resources.favorites'])

  .factory('FavoritesService', function(PortfolioService, FavoritesResource) {

    var getPortfolio = PortfolioService.getPortfolio;

    function getFavorites() {
      return getPortfolio().then(function(portfolio) {
        return FavoritesResource.getAll(portfolio.id);
      });
    }

    function saveLinkFavorite(linkFavorite) {
      return getPortfolio().then(function(portfolio) {
        return FavoritesResource.saveLinkFavorite(portfolio.id, linkFavorite);
      });
    }

    function saveTwitterFavorite(insertTwitterFavoriteRequest) {
      return getPortfolio().then(function(portfolio) {
        return FavoritesResource.saveTwitterFavorite(portfolio.id, insertTwitterFavoriteRequest);
      });
    }

    function updateFavoriteOrder(favoriteIdList) {
      return getPortfolio().then(function(portfolio) {
        return FavoritesResource.updateFavoriteOrder(portfolio.id, favoriteIdList);
      });
    }

    function deleteFavorite(favoriteId) {
      return getPortfolio().then(function(portfolio) {
        return FavoritesResource.deleteFavorite(portfolio.id, favoriteId);
      });
    }

    return {
      getFavorites: getFavorites,
      saveLinkFavorite: saveLinkFavorite,
      saveTwitterFavorite: saveTwitterFavorite,
      updateFavoriteOrder: updateFavoriteOrder,
      deleteFavorite: deleteFavorite
    };
  });
