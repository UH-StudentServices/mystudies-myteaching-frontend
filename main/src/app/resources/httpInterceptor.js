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

angular.module('resources.httpInterceptor', ['services.state', 'services.configuration'])

  .constant('ErrorPages', {
    'MAINTENANCE': 'maintenance'
  })

  .factory('HttpInterceptor', function HttpInterceptor($q,
                                                       $cookies,
                                                       $injector,
                                                       Configuration,
                                                       $location,
                                                       ErrorPages,
                                                       State,
                                                       $window,
                                                       ConfigurationProperties) {

    function redirectToErrorPage(errorPage) {
      $location.path('/error/' + errorPage);
    }

    var getStateFromDomain = function getStateFromDomain() {
      var host = $location.host();

      if (configurationPropertyContains(ConfigurationProperties.STUDENT_APP_URL, host)) {
        return State.MY_STUDIES;
      } else if (configurationPropertyContains(ConfigurationProperties.TEACHER_APP_URL, host)) {
        return State.MY_TEACHINGS;
      }
    };

    function configurationPropertyContains(property, expectedValue) {
      return Configuration[property] && Configuration[property].indexOf(expectedValue) > -1;
    }

    function success(response) {
      return response;
    }

    function redirectToLogin() {
      var StateChangeService = $injector.get('StateChangeService');

      StateChangeService.goToLogin();
    }

    function newUser() {
      return $cookies.get('OPINTONI_HAS_LOGGED_IN') === undefined;
    }

    function redirectToLander() {
      $location.path('/info/login');
    }

    function handleRedirect() {
      if (newUser()) {
        redirectToLander();
      } else {
        redirectToLogin();
      }
    }

    function handleForbidden() {
      var StateService = $injector.get('StateService');

      if (!StateService.currentOrParentStateMatches(State.ERROR)) {
        handleRedirect();
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
