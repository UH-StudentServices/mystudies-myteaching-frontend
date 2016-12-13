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

angular.module('opintoniLander', ['services.language',
                                  'services.login',
                                  'services.state',
                                  'services.configuration'])

  .constant('COURSE_SEARCH_URL', {
    en: 'https://courses.helsinki.fi/search',
    sv: 'https://courses.helsinki.fi/sv/search',
    fi: 'https://courses.helsinki.fi/fi/search '
  })

  .constant('LIBRARY_URL', {
    en: 'http://www.helsinki.fi/kirjasto/en/home/',
    sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
    fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/'
  })

  .config(function(
    $stateProvider,
    $translateProvider) {

    $stateProvider
      .state('lander', {
        parent: 'getState',
        url: '/info',
        views: {
          'content@': {
            templateUrl: 'app/partials/landerPages/_lander.html',
            controller: function($scope, state, LanguageService, LIBRARY_URL) {
              $scope.currentStateName = state;
              $scope.libraryUrl = LIBRARY_URL[LanguageService.getCurrent()];
            }
          }
        },
        resolve: {
          pageTitle: function($q, $translate, state, State) {
            var titleString = !state || state === State.MY_STUDIES ?
              'opintoni.pageHeaderBranding' :
              'opetukseni.pageHeaderBranding';

            return $translate(titleString)
              .then(function translateHeaderSuccess(title) {
                document.title = title;
                return title;
              });
          }
        }
      })

      .state('login', {
        parent: 'lander',
        url: '/login',
        templateUrl: 'app/partials/landerPages/_lander.login.html',
        controller: function($scope, Configuration, LanguageService, COURSE_SEARCH_URL, LoginService) {
          _.assign($scope, {
            loginUrls: {
              loginUrlStudent: Configuration.studentAppUrl,
              loginUrlTeacher: Configuration.teacherAppUrl
            },
            redirectToLogin: function() {
              LoginService.goToLogin();
            },
            courseSearchUrl: COURSE_SEARCH_URL[LanguageService.getCurrent()]
          });
        }
      })

      .state('localLogin', {
        parent: 'lander',
        url: '/local-login',
        templateUrl: 'app/partials/landerPages/_local.login.html',
        controller: function($scope, Configuration, LocalUsers, StateService, State, LoginService, Environments) {
          var state = StateService.getStateFromDomain(),
              envUsers = environmentUsers(Configuration.environment),
              users = state === State.MY_TEACHINGS ? envUsers.teachers : envUsers.students,
              isDemo = Configuration.environment === Environments.DEMO;

          function environmentUsers(environment) {
            if (environment === Environments.LOCAL ||
                environment === Environments.DEV) {
              return LocalUsers.local;
            } else if (environment === Environments.DEMO) {
              return LocalUsers.demo;
            } else {
              throw Error('unsupported environment for local login');
            }
          }

          _.assign($scope, {
            isDemo: isDemo,
            users: users,
            logInAs: LoginService.logInAs
          });
        }
      });
  });
