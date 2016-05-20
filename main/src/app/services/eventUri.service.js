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

    function hasBuilding(event) {
      return event.building && event.building.street;
    }

    function getPlace(building) {
      var place = building.street;

      if(building.zipCode) {
        place += '+' + building.zipCode;
      }

      return place;
    }

    function getGoogleMapsUri(event) {
      if (hasBuilding(event)) {
        var encoded = encodeURIComponent(getPlace(event.building));

        return 'https://www.google.fi/maps/place/' + encoded;
      } else {
        return undefined;
      }
    }

    function getReittiopasUri(event, fromAddress) {
      var to = event.building.street,
          start = event.startDate.tz(Timezones.HELSINKI),
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

    function reittiopasUriCanBeGenerated(event) {
      var now = moment().tz(Timezones.HELSINKI),
          start = event.startDate.clone().tz(Timezones.HELSINKI);

      return hasBuilding(event) && now.isBefore(start) && start.diff(now, 'days') < 7;
    }

    return {
      getGoogleMapsUri: getGoogleMapsUri,
      getReittiopasUri: getReittiopasUri,
      reittiopasUriCanBeGenerated: reittiopasUriCanBeGenerated
    };
  });