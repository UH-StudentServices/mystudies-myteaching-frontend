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

angular.module('resources.obar', [])
  .factory('ObarResource', function ObarResource($resource) {
    var publicObarResource = $resource('/api/public/v1/obar-jwt-token');
    var privateObarResource = $resource('/api/private/v1/obar-jwt-token');

    return {
      getPublicObarJwtToken: function getPublicJwtToken() {
        return publicObarResource.get().$promise;
      },
      getPrivateObarJwtToken: function getPrivateJwtToken() {
        return privateObarResource.get().$promise;
      }
    };
  });
