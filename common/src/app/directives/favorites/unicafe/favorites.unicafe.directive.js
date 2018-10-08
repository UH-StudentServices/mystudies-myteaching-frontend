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

angular.module('directives.favorites.unicafe', [
  'filters.moment',
  'services.favorites'
])

  .constant('UnicafeUrl', {
    fi: 'http://www.hyyravintolat.fi/#/',
    sv: 'http://www.hyyravintolat.fi/sv/#/',
    en: 'http://www.hyyravintolat.fi/en/#/'
  })

  .factory('UnicafeOpenDaysParser', function () {
    function isRestaurantClosed(menuData, nowMoment) {
      var closed = false;
      var exception;
      var reqular;
      var toDay;
      try {
        exception = menuData.information.business.exception;
        reqular = menuData.information.business.regular;
        toDay = _.capitalize(nowMoment.locale('FI').format('dd'));

        if (exception && exception.length > 0) {
          closed = closed || _.some(exception, function (e) {
            return e.closed && nowMoment.isBetween(moment(e.from, 'DD.M'), moment(e.to, 'DD.M'));
          });
        }

        if (reqular && reqular.length > 0) {
          closed = closed || _.every(_.flatten(_.map(reqular, 'when')), function (d) {
            return d !== toDay;
          });
        }
      } catch (e) {}

      return closed;
    }

    return { isRestaurantClosed: isRestaurantClosed };
  })

  .directive('favoritesUnicafe', function ($cookies,
    FavoritesService,
    UnicafeOpenDaysParser,
    UnicafeUrl,
    LanguageService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/unicafe/favorites.unicafe.html',
      replace: true,
      scope: { data: '=' },
      link: function ($scope) {
        var langKey = $cookies.get('OO_LANGUAGE');

        $scope.languageSuffix = langKey !== 'fi' ? '_' + langKey : '';
        $scope.restaurantOptions = [];
        $scope.selectedRestaurant = $scope.data.restaurantId;
        $scope.loading = true;
        $scope.unicafeUrl = _.get(UnicafeUrl, LanguageService.getCurrent());

        $scope.isSelected = function isSelected(id) {
          return id === $scope.selectedRestaurant;
        };

        function updateMenu(restaurantId) {
          FavoritesService.getUnicafeRestaurantMenu(restaurantId)
            .then(function getMenuSuccess(menuData) {
              $scope.closed = UnicafeOpenDaysParser.isRestaurantClosed(menuData, moment());
              $scope.information = menuData.information;
              $scope.menu = _.find(menuData.data, function (data) {
                return moment().diff(moment(data.date, 'DD.MM'), 'days') === 0;
              }).data;
            }).finally(function getMenuFinally() {
              $scope.loading = false;
            });
        }

        $scope.restaurantSelected = function restaurantSelected(restaurant) {
          $scope.selectedRestaurant = restaurant;
          $scope.loading = true;
          FavoritesService
            .updateUnicafeFavorite({ id: $scope.data.id, restaurantId: restaurant })
            .then(_.partial(updateMenu, restaurant));
        };

        updateMenu($scope.data.restaurantId);

        FavoritesService.getUnicafeRestaurantOptions().then(function (restaurantOptions) {
          _.each(restaurantOptions, function (area) {
            $scope.restaurantOptions.push({
              id: 0,
              name: area.name,
              isDisabled: true,
              selected: false
            });

            _.each(area.restaurants, function (restaurant) {
              $scope.restaurantOptions.push({
                id: restaurant.id,
                name: restaurant.name,
                isDisabled: false
              });
            });
          });
        });
      }
    };
  });
