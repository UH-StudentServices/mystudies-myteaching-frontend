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

angular.module('resources.httpInterceptor', ['services.state', 'directives.globalMessages'])

  .factory('HttpInterceptor', function HttpInterceptor($q, $injector, $location, GlobalMessagesService, State) {
    function success(response) {
      return response;
    }

    function goToLoginOrLander() {
      var LoginService = $injector.get('LoginService');

      LoginService.goToLoginOrLander();
    }

    function handleUnauthorized() {
      var StateService = $injector.get('StateService');
      if (!StateService.currentOrParentStateMatches(State.ERROR)) {
        goToLoginOrLander();
      }
    }

    function showGlobalErrorMessage(err) {
      return err.config && err.config.url
        && err.config.url.indexOf('/api/') > -1 && err.status !== 404;
    }

    function error(err) {
      var $state = $injector.get('$state');

      if (err.status === 401) {
        handleUnauthorized();
      } else if (err.status === 403) {
        $state.go(State.ACCESS_DENIED);
      } else if (showGlobalErrorMessage(err)) {
        GlobalMessagesService.addErrorMessage();
      }

      return $q.reject(err);
    }

    return {
      response: success,
      responseError: error
    };
  });
