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

angular.module('directives.fullWidthText', [])

  .directive('fullWidthText', function($window, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var element = angular.element(element);
        var parentElement = angular.element(element.parent());
        var getFontSize = function(element) {
          return element.css('font-size').replace('px', '');
        };
        var setFontSize = function(element, size) {
          element.css({'font-size': size + 'px'});
        };
        var marginLeft = Number(element.css('margin-left').replace('px', ''));
        var marginRight = Number(element.css('margin-right').replace('px', ''));
        var margins = marginLeft + marginRight;

        function resizeFont() {
          var elementWidth = element.width();

          if (elementWidth > 0) {
            var parentElementWidth = parentElement.width();
            var parentFontSize = getFontSize(parentElement);
            var originalFontSize = getFontSize(element);
            var newFontSize = (parentElementWidth - margins) / elementWidth * originalFontSize;

            if (attrs.hasOwnProperty('limitToParentFontSize')) {
              newFontSize = Math.min(newFontSize, parentFontSize);
            }

            if (newFontSize !== originalFontSize) {
              setFontSize(element, newFontSize);
            }
          }
        }

        angular.element($window).on('resize', function() { console.log('resized'); resizeFont(); });

        $timeout(resizeFont);
      }
    };
  });
