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

angular.module('directives.popover', ['angular-click-outside'])

  .directive('popover', function($templateCache, $compile) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/popover/popover.html',
      transclude: true,
      scope: {
        template: '@',
        overrideClass: '@',
        id: '@',
        triggerSelector: '@', // this can be either a class or an id, as prescribed by angular-click-outside
        targetSelector: '@',  // this must a valid CSS selector
        onClickTrigger: '&?',
        onClickOutside: '&?'
      },
      link: function(scope, el, attrs, ctrl, transclude) {
        var compiledTmpl = $compile($templateCache.get(attrs.template))(scope.$parent),
            targetEl = document.querySelector(scope.targetSelector),
            targetPos = window.getComputedStyle(targetEl).getPropertyValue('position'),
            triggerEl;

        transclude(scope.$parent, function() {
          el.append(compiledTmpl);
        });

        if(['relative', 'absolute'].indexOf(targetPos) < 0) {
          targetEl.style.position = 'relative';
        }

        _.assign(scope, {
          showPopover: scope.onClickTrigger ? true : false,
          closePopover: function() {
            if(scope.onClickOutside) {
              scope.onClickOutside();
            } else {
              scope.showPopover = false;
            }
          },
          togglePopover: function() {
            scope.showPopover = !scope.showPopover;
            scope.$apply();
          }
        });

        if(!scope.onClickTrigger) {
          triggerEl = document.querySelector('.' + scope.triggerSelector) ||
                      document.querySelector('#' + scope.triggerSelector);

          triggerEl.addEventListener('click', scope.togglePopover);
        }
      }
    };
  });
