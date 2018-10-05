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

angular.module('directives.favorites.unisport', [
  'services.favorites'
])

  .directive('favoritesUnisport', function (FavoritesService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/unisport/favorites.unisport.html',
      replace: true,
      scope: {
        data: '='
      },
      link: function ($scope) {
        function getEventTimeRange(startTime, endTime) {
          var momentStartTime = moment(startTime);
          var momentEndTime = moment(endTime);

          return momentStartTime.format('D.M.YYYY HH.mm') + ' - ' + momentEndTime.format('HH.mm');
        }

        FavoritesService.getUnisportUserReservations()
          .then(function getUserReservationsSuccess(data) {
            $scope.events = _(data.events).map(function (event) {
              event.timeRange = getEventTimeRange(event.startTime, event.endTime);
              return event;
            }).value();
            if (!_.isNull(data.authorizationUrl)) {
              $scope.authorizationUrl = data.authorizationUrl + '?redirectTarget=' + window.location.origin;
            }
          });
      }
    };
  });
