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

angular.module('resources.favorites.unicafe', [])

  .factory('UnicafeResource', function ($http) {
    var baseUrl = 'https://messi.hyyravintolat.fi/publicapi';

    var areas = [
      {
        id: 1,
        name: 'Keskusta',
        restaurants: []
      },
      {
        id: 2,
        name: 'Kumpula',
        restaurants: []
      },
      {
        id: 3,
        name: 'Meilahti',
        restaurants: []
      },
      {
        id: 5,
        name: 'Viikki',
        restaurants: []
      },
      {
        id: 6,
        name: 'Metropolia',
        restaurants: []
      }
    ];

    function getRestaurants() {
      return $http.get(baseUrl + '/restaurants').then(function (response) {
        return response.data;
      });
    }

    function getRestaurantMenu(restaurantId) {
      return $http.get(baseUrl + '/restaurant/' + restaurantId).then(function (response) {
        return response.data;
      });
    }

    function getRestaurantOptions() {
      return getRestaurants().then(function (restaurants) {
        var restaurantsByAreaCode = _.groupBy(restaurants.data, 'areacode');

        return _.map(areas, function (area) {
          area.restaurants = restaurantsByAreaCode[area.id];
          return area;
        });
      });
    }

    return {
      getRestaurantOptions: getRestaurantOptions,
      getRestaurantMenu: getRestaurantMenu
    };
  });
