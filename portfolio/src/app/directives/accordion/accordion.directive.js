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

angular.module('directives.accordion', [])

  .directive('accordion', function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/accordion/accordion.html',
      transclude: true,
      scope: {
        headingKey: '@',
        portfolioLang: '@'
      },
      link: function (scope, el) {
        var CONTENT_AREA_SELECTOR = '.accordion__contents';

        var contentHolder = el.find(CONTENT_AREA_SELECTOR);

        function toggle() {
          scope.isOpen = !scope.isOpen;
          contentHolder.slideToggle();
        }

        _.assign(scope, {
          isOpen: false,
          toggle: toggle
        });

        $timeout(function () {
          var textOrElementNodes = contentHolder.contents().toArray().filter(function (element) {
            return [1, 3].indexOf(element.nodeType) !== -1;
          });

          if (!textOrElementNodes.length) {
            el.remove();
          }
        });
      }
    };
  });
