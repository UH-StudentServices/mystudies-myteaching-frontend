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

angular.module('directives.languageSelector', [
  'services.portfolio',
  'services.portfolioRole',
  'services.session',
  'directives.popover'
])

  .directive('languageSelector', function ($q, $window, $state, $translate, PortfolioService,
    PortfolioRoleService, SessionService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/languageSelector/languageSelector.html',
      link: function (scope) {
        var supportedLangs = ['en', 'fi', 'sv'];
        var role = PortfolioRoleService.getActiveRole();
        var portfolio;
        var session;

        function canCreateRolePortfolioInLang(lang) {
          return Object.keys(session.portfolioPathsByRoleAndLang[role]).indexOf(lang) === -1;
        }

        function togglePopover() {
          scope.displayPopover = !scope.displayPopover;
        }

        function closePopover() {
          scope.displayPopover = false;
        }

        function confirm() {
          // use of _.defer is warranted since otherwise ngIf will
          // kick in before angular-click-outside which would
          // close the popover instead of presenting the user with a different dialog
          _.defer(function () {
            scope.hasConfirmed = true;
            scope.$apply();
          });
        }

        function hasMultiplePortfolios(userSession) {
          return Object.keys(userSession.portfolioPathsByRoleAndLang[role]).length > 1;
        }

        function createAndSwitchToNewPortfolio(lang) {
          PortfolioService.createPortfolio(role, lang).then(function (newPortfolio) {
            $window.location.href = newPortfolio.url;
          });
        }

        function switchToPortfolioInLang(lang) {
          if (canCreateRolePortfolioInLang(lang)) {
            createAndSwitchToNewPortfolio(lang);
          } else {
            $translate.fallbackLanguage(lang);
            $state.go('portfolio', { lang: lang });
          }
        }

        function translateCurrentLang(lang) {
          return $translate.instant(['languages', 'code', lang].join('.'));
        }

        $q.all([PortfolioService.getPortfolio(), SessionService.getSession()])
          .then(function (data) {
            portfolio = data[0];
            session = data[1];

            _.assign(scope, {
              currentLang: portfolio.lang,
              translatedLang: translateCurrentLang(portfolio.lang),
              supportedLangs: supportedLangs,
              availableLangs: supportedLangs.filter(canCreateRolePortfolioInLang),
              hasOnlyOnePortfolio: !hasMultiplePortfolios(session),
              togglePopover: togglePopover,
              closePopover: closePopover,
              confirm: confirm,
              createAndSwitchToNewPortfolio: createAndSwitchToNewPortfolio,
              switchToPortfolioInLang: switchToPortfolioInLang
            });
          });
      }
    };
  });
