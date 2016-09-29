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

angular.module('directives.scrollableTabBar', [])

  .directive('scrollableTabBar', function($window, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/scrollableTabBar/scrollableTabBar.html',
      transclude: true,
      scope: {
        tabSelector: '@',
        outermostTabPadding: '@'
      },
      link: function(scope, el, attrs) {
        function onResize() {
          scope.$applyAsync(function() {
            scope.showScrollControls = tabContainer.scrollWidth - outermostTabPadding > tabContainer.clientWidth;

            if (scope.showScrollControls) {
              disableScrollCtrlsIfScrollPosAtEnd();
              determineScrollStep();
            }
          });
        }

        function scrollBy(combinator) {
          tabContainer.scrollLeft = combinator(tabContainer.scrollLeft, SCROLL_STEP);
          disableScrollCtrlsIfScrollPosAtEnd();
        }

        function disableScrollCtrlsIfScrollPosAtEnd() {
          scope.$applyAsync(function() {
            _.assign(scope, {
              disableLeftScroll: !tabContainer.scrollLeft,
              disableRightScroll: tabContainer.scrollLeft === tabContainer.scrollWidth - tabContainer.clientWidth
            });
          });
        }

        function determineScrollStep() {
          var tab = el[0].querySelector(attrs.tabSelector),
              tabWidth = parseInt($window.getComputedStyle(tab).getPropertyValue('width'));

          if (tabWidth) {
            SCROLL_STEP = tabWidth;
          }
        }

        function useFullWidthLayout() {
          return scope.showScrollControls && $window.matchMedia(MOBILE_ONLY_BREAKPOINT_VALUE).matches;
        }

        var DEBOUNCE_DELAY = 200,
            SCROLL_STEP = 50,
            MOBILE_ONLY_BREAKPOINT_VALUE = '(max-width: 48em)',
            DEFAULT_SCROLLER_DISPLAY_THRESHOLD = 6, // this should equal horizontal tab padding on first/last tabs
            tabContainer = el[0].querySelector('.tab-bar__tab-container'),
            debouncedResizeHandler = _.debounce(onResize, DEBOUNCE_DELAY),
            outermostTabPadding = attrs.outermostTabPadding || DEFAULT_SCROLLER_DISPLAY_THRESHOLD;

        angular.element($window).on('resize', debouncedResizeHandler);

        scope.$on('$destroy', function() {
          angular.element($window).off('resize', debouncedResizeHandler);
        });

        _.assign(scope, {
          scrollLeft: _.partial(scrollBy, _.subtract),
          scrollRight: _.partial(scrollBy, _.add),
          useFullWidthLayout: useFullWidthLayout
        });

        $timeout(onResize, DEBOUNCE_DELAY);
      }
    };
  });
