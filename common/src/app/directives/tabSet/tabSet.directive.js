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

angular.module('directives.tabSet', ['directives.scrollableTabBar', 'ngAnimate', 'directives.visibility'])

  .directive('tabSet', function($compile, $templateCache, $animate) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/tabSet/tabSet.html',
      scope: {
        tabDescriptor: '=',
        useFullWidthOnMobile: '='
      },
      link: function(scope, el, attrs) {
        var activeTab,
            tabContentHolder = angular.element(el[0].querySelector('.tab-content')),
            FADE_IN_CLASS = 'fade-in',
            FADE_OUT_CLASS = 'fade-out';

        function selectTab(tab) {
          if (tab !== activeTab) {
            var compiledTmpl = $compile($templateCache.get(tab.templateUrl))(scope.$parent);

            activeTab = tab;
            $animate.addClass(tabContentHolder, FADE_OUT_CLASS, FADE_IN_CLASS)
              .then(function() {
                $animate.setClass(tabContentHolder, FADE_IN_CLASS, FADE_OUT_CLASS);
                tabContentHolder.html(compiledTmpl);
              });
          }
        }

        function getTabClasses(tab) {
          return {
            'is-active': tab === activeTab
          };
        }

        function selectDefaultTab() {
          selectTab(_.find(scope.tabs, function(tab) {
            return tab.activeByDefault;
          }));
        }

        _.assign(scope, {
          selectTab: selectTab,
          tabs: scope.tabDescriptor,
          getTabClasses: getTabClasses
        });

        selectDefaultTab();
      }
    };
  });
