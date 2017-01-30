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

angular.module('opintoniPortfolioApp', [
  'ui.router',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngAria',
  'pascalprecht.translate',
  'ui.utils',
  'portfolioErrors',
  'resources.httpInterceptor',
  'angular-click-outside',
  'templates',

  'constants.portfolioTabs',

  'provider.analyticsAccounts',

  'controllers.main',

  'directives.visibility',
  'directives.attainments',
  'directives.pageHeader',
  'directives.intro',
  'directives.menuLanguage',
  'directives.studies',
  'directives.favorites',
  'directives.contactInformation',
  'directives.focus',
  'directives.degrees',
  'directives.workExperience',
  'directives.samples',
  'directives.credits',
  'directives.navigation',
  'directives.dropdown',
  'directives.avatarImage',
  'directives.previewButton',
  'directives.previewMessage',
  'directives.freeTextContent',
  'directives.addNewComponent',
  'directives.embed',
  'directives.languageProficiencies',
  'directives.feedback',
  'directives.popover',
  'directives.cookieNotification',
  'directives.tabSet',
  'directives.stickyMessage',
  'directives.accordion',
  'directives.languageSelector',

  'filters.formatting',

  'services.session',
  'services.state',
  'services.userSettings',
  'services.portfolio',
  'services.keyword',
  'services.configuration',
  'services.portfolioRole',

  'utils.moment'
])

  .constant('preferredLanguage', 'fi')

  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $httpProvider,
    $cookiesProvider,
    $locationProvider,
    $compileProvider,
    preferredLanguage) {

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('HttpInterceptor');

    $urlRouterProvider.otherwise('/');

    $compileProvider.debugInfoEnabled(false);

    $stateProvider.state('portfolio', {
      url: '/:lang/:userpath',
      templateUrl: 'app/partials/_portfolio.html',
      controller: 'MainCtrl',
      resolve: {
        session: function(SessionService) {
          return SessionService.getSession();
        },
        state: function(StateService, $stateParams, session) {
          return StateService.resolve(session, $stateParams.lang, $stateParams.userpath);
        },
        userSettings: function(StateService, State, UserSettingsService, state) {
          if (state === State.PRIVATE) {
            return UserSettingsService.getUserSettings();
          }
        },
        portfolio: function(PortfolioService, $state, $stateParams, state) {
          return PortfolioService.findPortfolioByPath(state, $stateParams.lang, $stateParams.userpath)
            .catch(function findPortfolioFail(error) {
              if (error.status === 404) {
                $state.go('notFound');
              }
            });
        }
      }
    });

    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/portfolio-',
      suffix: '.json'
    });

    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.preferredLanguage(preferredLanguage);

    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.domain = '.helsinki.fi';
  })

  .run(function($rootScope, $window, LanguageService) {
    var language = LanguageService.getCurrent();

    $rootScope.selectedLanguage = language;
    moment.locale(language);
    $window.FastClick.attach($window.document.body);
  });
