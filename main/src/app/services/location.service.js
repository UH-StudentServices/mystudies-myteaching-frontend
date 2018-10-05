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

angular.module('services.location', [])

  .constant('UserAddressCookie', {
    NAME: 'address',
    TIMEOUT_IN_MINUTES: 10
  })

  .factory('LocationService', function ($q,
    $cookies,
    UserAddressCookie,
    GeolocationService,
    GoogleGeocoderService) {
    function putUserAddressToCookie(userAddress) {
      $cookies.put(UserAddressCookie.NAME, userAddress,
        { expires: moment().add(UserAddressCookie.TIMEOUT_IN_MINUTES, 'minutes').toDate() });
    }

    function getAddressFromCoordinates(latLng) {
      return GoogleGeocoderService.getAddressFromCoordinates(latLng);
    }

    function getUserAddressFromGeolocation() {
      var deferred = $q.defer();

      GeolocationService.getCoordinates()
        .then(getAddressFromCoordinates)
        .then(function getAddressFromCoordinatesSuccess(address) {
          deferred.resolve(address);
        })
        .catch(function getUserAddressFromGeoLocationError() {
          deferred.resolve('');
        });
      return deferred.promise;
    }

    function getUserAddressFromCookie() {
      return $cookies.get(UserAddressCookie.NAME);
    }

    return {
      getUserAddressFromGeolocation: getUserAddressFromGeolocation,
      getUserAddressFromCookie: getUserAddressFromCookie,
      putUserAddressToCookie: putUserAddressToCookie
    };
  })

  .factory('GeolocationService', function ($q) {
    function getCoordinates() {
      var deferred = $q.defer();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function currentPositionSuccess(position) {
          deferred.resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        }, function currentPositionError() {
          deferred.reject('Could not get current position');
        });
      } else {
        deferred.reject('Could not get current position');
      }
      return deferred.promise;
    }

    return {
      getCoordinates: getCoordinates
    };
  })

  .factory('GoogleGeocoderService', function ($q) {
    function geocoderStatusOk(status) {
      return status === google.maps.GeocoderStatus.OK;
    }

    function getAddressFromCoordinates(latLng) {
      var deferred = $q.defer();


      var googleLatLng = new google.maps.LatLng(latLng.lat, latLng.lng);

      new google.maps.Geocoder().geocode({ latLng: googleLatLng }, function (results, status) {
        if (geocoderStatusOk(status)) {
          var address = results[1];

          deferred.resolve(address ? address.formatted_address : '');
        } else {
          deferred.reject('Geocoder failed');
        }
      });
      return deferred.promise;
    }

    return {
      getAddressFromCoordinates: getAddressFromCoordinates
    };
  });
