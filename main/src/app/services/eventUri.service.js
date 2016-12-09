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

angular.module('services.eventUri', ['services.location'])

  .constant('Timezones', {
    HELSINKI: 'Europe/Helsinki'
  })

  .factory('EventUriService', function(Timezones, LocationService, BrowserUtil) {

    function hasStreetAddress(location) {
      return location.streetAddress;
    }

    function getPlace(location) {
      var place = location.streetAddress;

      if (location.zipCode) {
        place += '+' + location.zipCode;
      }

      return place;
    }

    function getGoogleMapsUri(location) {
      if (hasStreetAddress(location)) {
        var encoded = encodeURIComponent(getPlace(location));

        return 'https://www.google.fi/maps/place/' + encoded;
      } else {
        return undefined;
      }
    }

    function getReittiopasUri(startDate, location, fromAddress) {
      var to = location.streetAddress,
          start = startDate.tz(Timezones.HELSINKI),
          minutes = start.minute(),
          hours = start.hour(),
          date = start.date(),
          month = start.month() + 1,
          year = start.year();

      if (BrowserUtil.isMobile()) {
        return sprintf(
          'http://m.reittiopas.fi/fi/index.php?txtFrom=%s&txtTo=%s&minute=%02s&hour=%s&day=%s' +
          '&month=%s&year=%s&timetype=arrival&search=Hae+Reitti&cmargin=3&wspeed=70' +
          '&route-type=fastest&stz=0&bus=bus&tram=tram&metro=metro&train=train&uline=uline' +
          '&service=service&nroutes=3&is-now=OFF',
          fromAddress.substr(0, fromAddress.indexOf(',')), to, minutes, hours, date, month, year);
      } else {
        return sprintf(
          'http://www.reittiopas.fi/fi/?from=%s&to=%s&minute=%02s&hour=%s&day=%s&month=%s&year=%s' +
          '&timetype=arrival',
          fromAddress, to, minutes, hours, date, month, year);
      }
    }

    function reittiopasUriCanBeGenerated(startDate, location) {
      var now = moment().tz(Timezones.HELSINKI),
          start = startDate.clone().tz(Timezones.HELSINKI);

      return hasStreetAddress(location) && now.isBefore(start) && start.diff(now, 'days') < 7;
    }

    return {
      getGoogleMapsUri: getGoogleMapsUri,
      getReittiopasUri: getReittiopasUri,
      reittiopasUriCanBeGenerated: reittiopasUriCanBeGenerated
    };
  });
