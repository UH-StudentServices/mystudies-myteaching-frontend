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
  'ngEmbed',
  'pascalprecht.translate',
  'angular-google-analytics',
  'ui.utils',
  'portfolioAnalytics',
  'portfolioErrors',
  'resources.httpInterceptor',
  'angular-click-outside',
  'as.sortable',
  'templates',

  'constants.portfolioTabs',

  'provider.analyticsAccounts',

  'controllers.main',
  'controllers.tinymce',

  'directives.visibility',
  'directives.attainments',
  'directives.pageHeader',
  'directives.intro',
  'directives.menuLanguage',
  'directives.studies',
  'directives.contactInformation',
  'directives.focus',
  'directives.editableHeading',
  'directives.degrees',
  'directives.workExperience',
  'directives.samples',
  'directives.navigation',
  'directives.dropdown',
  'directives.avatarImage',
  'directives.printButton',
  'directives.previewButton',
  'directives.previewMessage',
  'directives.freeTextContent',
  'directives.addFreeText',
  'directives.languageProficiencies',
  'directives.feedback',
  'directives.popover',
  'directives.cookieNotification',
  'directives.tabSet',
  'directives.stickyMessage',
  'directives.accordion',
  'directives.languageSelector',
  'directives.notifications',
  'directives.browseFiles',

  'dialog.verificationDialog',

  'filters.formatting',

  'services.session',
  'services.language',
  'services.state',
  'services.userSettings',
  'services.portfolio',
  'services.keyword',
  'services.configuration',
  'services.portfolioRole',
  'services.scriptInjector',
  'services.preview',
  'services.freeTextContent',
  'services.browseFiles',
  'resources.notifications',

  'utils.moment'
])

  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $httpProvider,
    $locationProvider,
    $compileProvider,
    $qProvider,
    $sceDelegateProvider
  ) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('HttpInterceptor');

    $urlRouterProvider.otherwise('/');

    $compileProvider.debugInfoEnabled(false);

    $qProvider.errorOnUnhandledRejections(false);

    $stateProvider.state('portfolio', {
      url: '/:lang/:userpath',
      templateUrl: 'app/partials/_portfolio.html',
      controller: 'MainCtrl',
      resolve: {
        session: function (SessionService) {
          return SessionService.getSession();
        },
        state: function (StateService, $stateParams, session) {
          return StateService.resolve(session, $stateParams.lang, $stateParams.userpath);
        },
        userSettings: function (StateService, State, UserSettingsService, state) {
          if (state === State.PRIVATE) {
            return UserSettingsService.getUserSettings();
          }
          return undefined;
        },
        notifications: function (NotificationsResource, session) {
          if (session && session.$resolved) {
            return NotificationsResource.getNotifications();
          }
          return undefined;
        },
        portfolio: function (PortfolioService,
          FreeTextContentService,
          $location,
          $state,
          $stateParams,
          session,
          state,
          $translate) {
          $translate.fallbackLanguage($stateParams.lang);
          return PortfolioService.findPortfolioByPath(
            state,
            $stateParams.lang,
            $stateParams.userpath
          )
            .catch(function findPortfolioFail(error) {
              if (error.status === 404) {
                if (session) {
                  $state.go('notFound');
                } else {
                  $state.go('loginNeeded', { originalUrl: $location.absUrl() });
                }
              }
            })
            .finally(function () {
              FreeTextContentService.initCache();
            });
        }
      }
    });

    $stateProvider.state('files', {
      url: '/files',
      templateUrl: 'app/partials/_files.html'
    });

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from embed.ly.
      'https://api.embed.ly/1/oembed**'
    ]);
  })

  .run(function ($rootScope, $window, LanguageService, AnalyticsService) {
    var language = LanguageService.getCurrent();

    $rootScope.selectedLanguage = language;
    moment.locale(language);
    $window.FastClick.attach($window.document.body);

    AnalyticsService.trackPageView();
  });
