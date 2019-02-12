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

angular.module('directives.obar', [])
  .directive('obar', function (Configuration, ObarService, BrowserUtil) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/obar/obar.html',
      scope: { app: '@' },
      link: function ($scope) {
        var body = document.body;
        var head = document.head;
        var link = document.createElement('link');
        var baseUrl = Configuration.obarBaseUrl;

        function loadScript(script) {
          var scriptElement = document.createElement('script');
          scriptElement.src = baseUrl + '/' + script + '.js';
          scriptElement.innerHTML = '';
          scriptElement.async = false;
          scriptElement.defer = true;
          body.appendChild(scriptElement);
        }

        ObarService.getObarJwtToken().then(function (jwtToken) {
          $scope.baseUrl = baseUrl;
          $scope.jwtToken = jwtToken;

          link.rel = 'stylesheet';
          link.href = baseUrl + '/obar.css';
          head.appendChild(link);

          if (!BrowserUtil.isModernBrowser()) {
            loadScript('polyfills');
          }
          loadScript('obar');
        });
      }
    };
  });
