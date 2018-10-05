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

angular.module('services.favorites', [
  'opintoniAnalytics',
  'resources.favorites',
  'resources.favorites.rss',
  'resources.favorites.unicafe',
  'resources.favorites.unisport',
  'utils.moment'
])

  .factory('FavoritesService', function (FavoritesResource,
    RSSResource,
    UnicafeResource,
    UnisportResource,
    AnalyticsService,
    dateArrayToMomentObject) {
    function getFavorites() {
      return FavoritesResource.getAll();
    }

    function saveRSSFavorite(rssFavorite, favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveRSSFavorite(rssFavorite);
    }

    function getRSSFeed(feedUrl) {
      function convertDate(d) {
        return dateArrayToMomentObject(_.slice(d, 0, 5));
      }
      return RSSResource.get(feedUrl).then(function (feed) {
        return {
          title: feed.title,
          link: feed.feedUrl,
          description: feed.description,
          date: feed.pubDate,
          momentDate: convertDate(feed.date),
          entries: _.each(feed.items, function (entry) {
            entry.momentDate = convertDate(entry.date);
          })
        };
      });
    }

    function findRSSFeed(feedUrl) {
      return RSSResource.findFeed(feedUrl);
    }

    function saveUnicafeFavorite(unicafeFavoriteRequest, favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveUnicafeFavorite(unicafeFavoriteRequest);
    }

    function updateUnicafeFavorite(unicafeFavoriteRequest, favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.updateUnicafeFavorite(unicafeFavoriteRequest);
    }

    function getUnicafeRestaurantMenu(restaurantId) {
      return UnicafeResource.getRestaurantMenu(restaurantId);
    }

    function getUnicafeRestaurantOptions() {
      return UnicafeResource.getRestaurantOptions();
    }

    function saveUnisportFavorite(favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveUnisportFavorite();
    }

    function saveUnisportFavorite(favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveUnisportFavorite();
    }

    function getUnisportUserReservations() {
      return UnisportResource.getUserReservations();
    }

    function saveTwitterFavorite(insertTwitterFavoriteRequest, favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveTwitterFavorite(insertTwitterFavoriteRequest);
    }

    function updateFavoriteOrder(favoriteIdList) {
      return FavoritesResource.updateFavoriteOrder(favoriteIdList);
    }

    function deleteFavorite(favoriteId, favoriteType) {
      AnalyticsService.trackRemoveFavorite(favoriteType);
      return FavoritesResource.deleteFavorite(favoriteId);
    }

    function saveFlammaFavorite(favoriteType) {
      AnalyticsService.trackAddFavorite(favoriteType);
      return FavoritesResource.saveFlammaFavorite(favoriteType);
    }

    return {
      getFavorites: getFavorites,
      saveRSSFavorite: saveRSSFavorite,
      getRSSFeed: getRSSFeed,
      findRSSFeed: findRSSFeed,
      saveUnicafeFavorite: saveUnicafeFavorite,
      updateUnicafeFavorite: updateUnicafeFavorite,
      getUnicafeRestaurantMenu: getUnicafeRestaurantMenu,
      getUnicafeRestaurantOptions: getUnicafeRestaurantOptions,
      saveUnisportFavorite: saveUnisportFavorite,
      getUnisportUserReservations: getUnisportUserReservations,
      saveTwitterFavorite: saveTwitterFavorite,
      updateFavoriteOrder: updateFavoriteOrder,
      deleteFavorite: deleteFavorite,
      saveFlammaFavorite: saveFlammaFavorite
    };
  });
