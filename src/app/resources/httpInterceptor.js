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
    'MAINTENANCE': 'maintenance'
  })

  .factory('HttpInterceptor', function HttpInterceptor($q,
                                                       $cookies,
                                                       Configuration,
                                                       $location,
                                                       ErrorPages) {

    function redirectToErrorPage(errorPage) {
      $location.path('/error/' + errorPage);
    }

    var getStateFromDomain = function getStateFromDomain() {
      var host = $location.host();

      if (configurationPropertyContains('studentAppUrl', host)) {
        return 'opintoni';
      } else if (configurationPropertyContains('teacherAppUrl', host)) {
        return 'opetukseni';
      } else {
        return undefined;
      }
    };

    function configurationPropertyContains(property, expectedValue) {
      return Configuration[property] && Configuration[property].indexOf(expectedValue) > -1;
    }

    function success(response) {
      return response;
    }

    function redirectToLogin() {
      var state = getStateFromDomain();

      if (!state || state === 'opintoni') {
        window.location.href = Configuration.loginUrlStudent;
      } else if (state === 'opetukseni') {
        window.location.href = Configuration.loginUrlTeacher;
      }
    }

    function newUser() {
      return $cookies.get('OPINTONI_HAS_LOGGED_IN') === undefined;
    }

    function redirectToLander() {
      $location.path('/info/login');
    }

    function handleForbidden() {
      if (newUser()) {
        redirectToLander();
      } else {
        redirectToLogin();
      }
    }

    function error(response) {
      if (response.status === 401) {
        handleForbidden();
      } else if (response.status === 503) {
        redirectToErrorPage(ErrorPages.MAINTENANCE);
      }
      return $q.reject(response);
    }

    return {
      response: success,
      responseError: error
    };

  });
