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

angular.module('directives.scriptLoad', [])

  .directive('scriptLoad', function() {
    var isRendered = false;

    return {
      restrict: 'E',
      scope: {
        scriptSrc: '@'
      },
      link: function(scope) {
        if(!isRendered) {
          isRendered = true;
          var script = document.createElement('script');

          script.type = 'text/javascript';
          script.src = scope.scriptSrc;
          script.async = true;
          document.getElementsByTagName('head')[0].appendChild(script);
        }
      }
    };
  });
