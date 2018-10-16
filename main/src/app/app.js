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

'use strict';

angular.module('opintoniApp', [
  'LocalStorageModule',
  'ngResource',
  'ui.router',
  'ngCookies',
  'pascalprecht.translate',
  'ngAnimate',
  'ngSanitize',
  'ngAria',
  'ngAddToHomescreen',
  'angular-google-analytics',
  'ui.utils',
  'opintoniAnalytics',
  'opintoniErrors',
  'opintoniLander',
  'angular-click-outside',
  'as.sortable',

  'provider.analyticsAccounts',

  'services.session',
  'services.language',
  'services.userSettings',
  'services.configuration',
  'services.location',
  'services.courses',
  'services.login',
  'services.scriptInjector',

  'resources.httpInterceptor',
  'resources.stateInterceptor',
  'resources.events',
  'resources.notifications',

  'directives.menuLanguage',
  'directives.dropdown',
  'directives.editLink',
  'directives.feedback',
  'directives.visibility',
  'directives.pageNavigation',
  'directives.stickyMessage',
  'directives.notifications',

  'controllers.main',
  'controllers.calendar',

  'directives.pageBanner',
  'directives.helpIcon',
  'directives.popover',
  'directives.cookieNotification',
  'directives.scrollableTabBar',

  'ui.calendar',
  'utils.loader'
])
  .run(function ($rootScope, $window, LanguageService) {
    $rootScope.selectedLanguage = LanguageService.getCurrent();
    moment.locale($rootScope.selectedLanguage);
    $window.FastClick.attach($window.document.body);
  })

  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $locationProvider,
    $compileProvider,
    $qProvider,
    $sceDelegateProvider
  ) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $httpProvider.interceptors.push('HttpInterceptor');

    $urlRouterProvider.otherwise('/init');

    $compileProvider.debugInfoEnabled(false);

    $qProvider.errorOnUnhandledRejections(false);

    $stateProvider
      .state('root', {
        abstract: true,
        params: { currentDate: null },
        resolve: {
          session: function ($q, SessionService, $state) {
            return SessionService.getSession().then(function getSessionSuccess(session) {
              return session;
            }, function getSessionError() {
              $state.go('noSession');
            });
          },
          userSettings: function (UserSettingsService) {
            return UserSettingsService.getUserSettings()
              .then(function getUserSettingsSuccess(userSettings) {
                return userSettings;
              }, function getUserSettingsError() {
                return undefined;
              });
          },
          notifications: function (NotificationsResource, session) {
            if (session && session.$resolved) {
              return NotificationsResource.getNotifications();
            }
            return undefined;
          }
        }
      })
      .state('init', {
        url: '/init',
        parent: 'root',
        resolve: {
          toState: function (StateService, session) {
            var stateFromDomain = StateService.getStateFromDomain();

            if (stateFromDomain) {
              return stateFromDomain;
            }
            return StateService.getDefaultStateForUser(session);
          }
        },
        onEnter: function onEnter($state, toState) {
          $state.go(toState);
        }
      })
      .state('opintoni', {
        url: '/opintoni',
        parent: 'root',
        data: {
          roles: ['STUDENT'],
          pageTitle: 'opintoni.title',
          calendarState: 'opintoniCalendar'
        },
        views: {
          'content@': {
            templateUrl: 'app/partials/layout.html',
            controller: 'MainCtrl'
          }
        },
        resolve: {
          pageTitle: function ($q, $translate) {
            var deferred = $q.defer();

            $translate('opintoni.pageHeaderBranding').then(function translateHeaderSuccess(title) {
              document.title = title;
              deferred.resolve(title);
            });
            return deferred.promise;
          },
          getCourses: function (CoursesService) {
            return CoursesService.getStudentCourses;
          },
          getEvents: function (EventsResource) {
            return EventsResource.getStudentEvents;
          }
        },
        onEnter: function onEnter(ngAddToHomescreen) {
          ngAddToHomescreen({ maxDisplayCount: 1 });
        }
      })
      .state('opetukseni', {
        url: '/opetukseni',
        parent: 'root',
        data: {
          roles: ['TEACHER'],
          pageTitle: 'opetukseni.title',
          calendarState: 'opetukseniCalendar'
        },
        views: {
          'content@': {
            templateUrl: 'app/partials/layout.html',
            controller: 'MainCtrl'
          }
        },
        resolve: {
          pageTitle: function ($q, $translate) {
            return $translate('opetukseni.pageHeaderBranding')
              .then(function translateHeaderSuccess(title) {
                document.title = title;
              });
          },
          getCourses: function (CoursesService) {
            return CoursesService.getTeacherCourses;
          },
          getEvents: function (EventsResource) {
            return EventsResource.getTeacherEvents;
          }
        },
        onEnter: function onEnter(ngAddToHomescreen) {
          ngAddToHomescreen({ maxDisplayCount: 1 });
        }
      })
      .state('opintoniCalendar', {
        url: '/kalenteri',
        parent: 'opintoni',
        views: {
          'content@': {
            templateUrl: 'app/partials/calendarLayout.html',
            controller: 'CalendarCtrl'
          }
        }
      })
      .state('opetukseniCalendar', {
        url: '/kalenteri',
        parent: 'opetukseni',
        views: {
          'content@': {
            templateUrl: 'app/partials/calendarLayout.html',
            controller: 'CalendarCtrl'
          }
        }
      })
      .state('admin', {
        url: '/admin',
        parent: 'root',
        data: {
          roles: ['ADMIN'],
          pageTitle: 'opetukseni.title'
        },
        views: {
          'content@': {
            templateUrl: 'app/partials/adminLayout.html',
            controller: 'MainCtrl'
          }
        },
        resolve: {
          pageTitle: function () {
            var title = 'Admin';

            document.title = title;
            return title;
          },
          getCourses: function (CoursesService) {
            return CoursesService.getTeacherCourses;
          },
          getEvents: function (EventsResource) {
            return EventsResource.getTeacherEvents;
          }
        }
      })
      .state('versionInfo', {
        url: '/version-info',
        parent: 'root',
        views: {
          'content@': {
            templateUrl: 'app/partials/versionInfoLayout.html',
            controller: 'MainCtrl'
          }
        },
        resolve: {
          pageTitle: function () {
            var title = 'Version info';

            document.title = title;
            return title;
          },
          getCourses: function () {
            return function () { return []; };
          },
          getEvents: function () {
            return function () { return []; };
          }
        }
      })

      .state('getState', {
        abstract: true,
        resolve: {
          state: [
            'StateService', function (StateService) {
              return StateService.getStateFromDomain();
            }
          ]
        }
      })

      .state('noSession', {}); // State to terminate ui processing in case of no session

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from embed.ly.
      'https://api.embed.ly/1/oembed**'
    ]);
  });
