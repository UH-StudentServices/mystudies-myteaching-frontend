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

/* eslint no-restricted-globals: 0 */

'use strict';

// eslint-disable-next-line no-unused-expressions
!(function () {
  var CONFIG_RESOURCE_PATH = '/api/public/v1/configuration';
  var TIMEOUT = 5000;
  var ERROR_PAGE_PATH = '/error/maintenance';
  var PROFILE_PATH = '/profile';

  var isProfile = function () {
    return location.pathname.indexOf(PROFILE_PATH) !== -1;
  };

  var RESOLVED_ERROR_PAGE_PATH = isProfile() ? PROFILE_PATH + ERROR_PAGE_PATH : ERROR_PAGE_PATH;

  var NG_APP_NAME = isProfile() ? 'opintoniProfileApp' : 'opintoniApp';

  var bootstrap = function () {
    angular.element(document).ready(function () {
      angular.bootstrap(document, [NG_APP_NAME]);
    });
  };

  var redirectToErrorPage = function () {
    location.pathname = RESOLVED_ERROR_PAGE_PATH;
  };

  var fetchConf = function () {
    var injector = angular.injector(['ng']);
    var $http = injector.get('$http');

    return $http.get(CONFIG_RESOURCE_PATH, { timeout: TIMEOUT })
      .then(function (res) {
        window.configuration = res.data;
        return res;
      });
  };
  if (location.pathname !== RESOLVED_ERROR_PAGE_PATH) {
    fetchConf()
      .catch(redirectToErrorPage)
      .then(bootstrap);
  } else {
    bootstrap();
  }
}());
