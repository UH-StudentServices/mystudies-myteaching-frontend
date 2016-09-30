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

angular.module('opintoniPortfolioApp',
  ['ui.router',
   'ngCookies',
   'ngResource',
   'ngSanitize',
   'ngAnimate',
   'ngAria',
   'pascalprecht.translate',
   'ui.utils',
   'angular-google-analytics',
   'portfolioErrors',
   'resources.httpInterceptor',
   'angular-click-outside',
   'templates',

   'constants.portfolioTabs',

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

   'filters.formatting',

   'services.session',
   'services.state',
   'services.userSettings',
   'services.portfolio',
   'services.keyword',
   'services.configuration',
   'services.portfolioRole',
   'portfolioAnalytics',
   'utils.moment'])

  .constant('preferredLanguage', 'en')

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

    $stateProvider.state('site', {
      url: '/:path',
      templateUrl: 'app/partials/_portfolio.html',
      controller: 'MainCtrl',
      resolve: {
        portfolioRole: function(PortfolioRoleService) {
          return PortfolioRoleService.getPortfolioRoleFromDomain();
        },
        session: function(SessionService, StateService, $stateParams, portfolioRole) {
          return SessionService.getSession().then(function getSessionSuccess(session) {
            return StateService.resolveCurrent(session, portfolioRole, $stateParams.path);
          }, function getSessionFail() {
            return null;
          });
        },
        userSettings: function(StateService, State, UserSettingsService, session) {
          if (StateService.getCurrent() === State.PRIVATE) {
            return UserSettingsService.getUserSettings();
          }
        },
        portfolio: function($stateParams, PortfolioService, $state, userSettings, portfolioRole) {
          return PortfolioService.findPortfolioByPath(portfolioRole, $stateParams.path)
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

  .run(function($rootScope, $translate, LanguageService) {
    var language = LanguageService.getCurrent();

    $rootScope.userLang = language;
    moment.locale(language);
  });
