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

angular.module('directives.weekFeed.feedItem.event',[
  'services.location',
  'services.eventUri'])

  .directive('event', function(LocationService, EventUriService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/feedItem/event/event.html',
      scope: {
        feedItem: '=',
        showCourseImage: '='
      },
      link: function($scope) {
        $scope.openReittiopas = function openReittiopas(feedItem) {
          var addressFromCookie = LocationService.getUserAddressFromCookie();

          if (addressFromCookie) {
            window.location = EventUriService.getReittiopasUri(feedItem, addressFromCookie);
          } else {
            feedItem.loadingLocation = true;
            LocationService.getUserAddressFromGeolocation().then(function(data) {
              LocationService.putUserAddressToCookie(data);
              window.location = EventUriService.getReittiopasUri(feedItem, data);
            });
          }
        };
      }
    };
  })

  .directive('eventTitle', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/feedItem/event/eventTitle.html'
    };
  })

  .filter('eventTimeSpan', function() {
    var dateString = 'DD.MM.YYYY',
        hoursString = 'HH:mm';

    function momentDateHasHours(momentDate) {
      return _.isArray(momentDate._i) && momentDate._i.length > 3;
    }

    function getFormatString(momentDate) {
      if (momentDateHasHours(momentDate)) {
        return dateString + ' ' + hoursString;
      } else {
        return dateString;
      }
    }

    function formatMomentDate(momentDate) {
      return momentDate.format(getFormatString(momentDate));
    }

    function formatMomentDateSpan(startDate, endDate) {
      return formatMomentDate(startDate) + ' - ' + formatMomentDate(endDate);
    }

    function formatMomentDateTimeSpan(startDate, endDate) {
      var dateString = formatMomentDate(startDate);

      if (momentDateHasHours(startDate) && momentDateHasHours(endDate)) {
        dateString += ' - ' + endDate.format(hoursString);
      }
      return dateString;
    }

    return function(startDate, endDate) {

      /* Dates are UTC but we want to show them as local times */
      startDate = startDate.local();
      endDate = endDate.local();

      if (startDate.diff(endDate) === 0) {
        return formatMomentDate(startDate);
      } else if (startDate.year() === endDate.year() &&
                 startDate.dayOfYear() === endDate.dayOfYear()) {
        return formatMomentDateTimeSpan(startDate, endDate);
      } else {
        return formatMomentDateSpan(startDate, endDate);
      }
    };
  });