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

angular.module('resources.httpInterceptor', ['services.state'])

  .constant('ErrorPages', {
    MAINTENANCE: 'maintenance'
  })

  .factory('HttpInterceptor', function HttpInterceptor($q, Configuration, $location, ErrorPages) {
    function redirectToErrorPage(errorPage) {
      $location.path('/error/' + errorPage);
    }

    function success(response) {
      return response;
    }

    function error(response) {
      if (response.status === 503) {
        redirectToErrorPage(ErrorPages.MAINTENANCE);
      }
      return $q.reject(response);
    }

    return {
      response: success,
      responseError: error
    };
  });
