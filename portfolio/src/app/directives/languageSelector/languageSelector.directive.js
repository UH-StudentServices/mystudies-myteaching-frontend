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

angular.module('directives.languageSelector', ['services.portfolio',
                                               'directives.popover'])

  .directive('languageSelector', function(PortfolioService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/languageSelector/languageSelector.html',
      link: function(scope) {
        var availableLangs = ['en', 'fi', 'sv'];

        function togglePopover() {
          scope.displayPopover = !scope.displayPopover;
        }

        function closePopover() {
          scope.displayPopover = false;
        }

        PortfolioService.getPortfolio().then(function(portfolio) {
          scope = _.assign(scope, {
            currentLang: portfolio.lang,
            availableLangs: availableLangs,
            togglePopover: togglePopover,
            closePopover: closePopover
          });
        });
      }
    };
  });
