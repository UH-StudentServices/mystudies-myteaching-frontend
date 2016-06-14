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

!function() {
  var CONFIG_RESOURCE_PATH = '/api/public/v1/configuration',
      TIMEOUT = 5000,
      ERROR_PAGE_PATH = '/error/maintenance',
      PORTFOLIO_PATH = '/portfolio',
      isPortfolio = function() {
        return location.pathname.indexOf(PORTFOLIO_PATH) !== -1;
      },
      RESOLVED_ERROR_PAGE_PATH = isPortfolio() ? PORTFOLIO_PATH + ERROR_PAGE_PATH : ERROR_PAGE_PATH,
      NG_APP_NAME = isPortfolio() ? 'opintoniPortfolioApp' : 'opintoniApp',
      bootstrap = function(res) {
        angular.element(document).ready(function() {
          angular.bootstrap(document, [NG_APP_NAME]);

          if(!res && location.pathname !== RESOLVED_ERROR_PAGE_PATH) {
            location.pathname = RESOLVED_ERROR_PAGE_PATH;
          }
        });
      },
      fetchConf = function() {
        var injector = angular.injector(['ng']),
            $http = injector.get('$http');

        return $http.get(CONFIG_RESOURCE_PATH, {timeout: TIMEOUT})
          .then(function(res) {
            window.configuration = res.data;
            return res;
          })
          .catch(function() {
            return false;
          });
      };

  if(location.pathname !== RESOLVED_ERROR_PAGE_PATH) {
    fetchConf().then(bootstrap);
  } else {
    bootstrap();
  }
}();
