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
  'ngTouch',
  'ngSanitize',
  'angular-carousel',
  'angularUtils.directives.dirPagination',
  'ngAria',
  'ngJoyRide',
  'ngAddToHomescreen',
  'angular-google-analytics',
  'ui.utils',
  'opintoniAnalytics',
  'opintoniErrors',
  'opintoniLander',

  'services.session',
  'services.userSettings',
  'services.configuration',
  'services.location',
  'services.courses',

  'resources.httpInterceptor',
  'resources.stateInterceptor',
  'resources.events',

  'directives.menuLanguage',
  'directives.dropdown',
  'directives.editLink',
  'directives.feedback',
  'directives.visibility',
  'directives.courseRecommendations',
  'directives.pageNavigation',

  'controllers.main',
  'directives.tour',
  'directives.pageBanner',
  'directives.mobilePageBanner',
  'directives.helpIcon',
  'ui.calendar',
  'utils.loader'
])
  .constant('preferredLanguage', 'fi')

  .run(function($rootScope, $location, LanguageService, ngAddToHomescreen) {
    if ($location.path() !== '/info/login') {
      ngAddToHomescreen({maxDisplayCount: 1});
    }
    $rootScope.userLang = LanguageService.getCurrent();
    moment.locale($rootScope.userLang);
  })

  .config(function(
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $locationProvider,
    $translateProvider,
    $cookiesProvider,
    paginationTemplateProvider,
    preferredLanguage) {

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('HttpInterceptor');

    paginationTemplateProvider.setPath('app/opintoni/views/partials/_dir_pagination.html');

    $urlRouterProvider.otherwise('/init');

    $stateProvider
      .state('root', {
        abstract: true,
        resolve: {
          session: function($q, SessionService, $state) {
            return SessionService.getSession().then(function getSessionSuccess(session) {
              return session;
            }, function getSessionError() {
              $state.go('noSession');
            });
          },
          userSettings: function(UserSettingsService, session) {
            return UserSettingsService.getUserSettings()
              .then(function getUserSettingsSuccess(userSettings) {
                return userSettings;
              }, function getUserSettingsError() {
                return undefined;
              });
          }
        }
      })
      .state('init', {
        url: '/init',
        parent: 'root',
        resolve: {
          toState: function(StateService, session) {
            var stateFromDomain = StateService.getStateFromDomain();

            if(stateFromDomain) {
              return stateFromDomain;
            } else {
              return StateService.getDefaultStateForUser(session);
            }
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
          pageTitle: 'opintoni.title'

        },
        views: {
          'content@': {
            templateUrl: 'app/partials/layout.html',
            controller: 'MainCtrl'
          }
        },
        resolve: {
          pageTitle: function($q, $translate) {
            var deferred = $q.defer();

            $translate('opintoni.pageHeaderBranding').then(function translateHeaderSuccess(title) {
              document.title = title;
              deferred.resolve(title);
            });
            return deferred.promise;
          },
          getCourses: function(CoursesService) {
            return CoursesService.getStudentCourses;
          },
          getEvents: function(EventsResource) {
            return EventsResource.getStudentEvents;
          }
        }
      })
      .state('opetukseni', {
        url: '/opetukseni',
        parent: 'root',
        data: {
          roles: ['TEACHER'],
          pageTitle: 'opetukseni.title'
        },
        views: {
          'content@': {
            templateUrl: 'app/partials/layout.html',
            controller: 'MainCtrl'

          }
        },
        resolve: {
          pageTitle: function($q, $translate) {
            var deferred = $q.defer();

            $translate('opetukseni.pageHeaderBranding')
              .then(function translateHeaderSuccess(title) {
                document.title = title;
                deferred.resolve(title);
              });

            return deferred.promise;
          },
          getCourses: function(CoursesService) {
            return CoursesService.getTeacherCourses;
          },
          getEvents: function(EventsResource) {
            return EventsResource.getTeacherEvents;
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
          pageTitle: function() {
            var title = 'Admin';

            document.title = title;
            return title;
          },
          getCourses: function(CoursesService) {
            return CoursesService.getTeacherCourses;
          },
          getEvents: function(EventsResource) {
            return EventsResource.getTeacherEvents;
          }
        }
      })

      .state('getState', {
        abstract: true,
        resolve: {
          state: ['StateService', function(StateService) {
            return StateService.getStateFromDomain();
          }]
        }
      })

      .state('noSession', {}); //State to terminate ui processing in case of no session

    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/opintoni-',
      suffix: '.json'
    });
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.preferredLanguage(preferredLanguage);

    $cookiesProvider.defaults.path = '/';
    $cookiesProvider.defaults.domain = '.helsinki.fi';
  });
