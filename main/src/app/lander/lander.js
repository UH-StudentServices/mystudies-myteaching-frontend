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

angular.module('opintoniLander', ['services.language'])

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
        controller: function($scope, state, Configuration, LanguageService, COURSE_SEARCH_URL,
                             $window, StateChangeService, State) {
          var loginUrl = !state || state === State.MY_STUDIES ?
            Configuration.loginUrlStudent :
            Configuration.loginUrlTeacher;

          $scope.loginUrls = {
            loginUrlStudent: Configuration.studentAppUrl,
            loginUrlTeacher: Configuration.teacherAppUrl
          };

          $scope.redirectToLogin = function() {
            StateChangeService.goToLogin();
          };

          $scope.courseSearchUrl = COURSE_SEARCH_URL[LanguageService.getCurrent()];
        }
      })

      .state('localLogin', {
        parent: 'lander',
        url: '/local-login',
        templateUrl: 'app/partials/landerPages/_local.login.html',
        controller: function($scope, Configuration, Environments, DemoUsers, StateService, State, DemoEnvPassword) {
          var state = StateService.getStateFromDomain(),
              users = state === State.MY_TEACHINGS ? DemoUsers.TEACHERS : DemoUsers.STUDENTS;

          if (Configuration.environment === Environments.DEMO) {
            $scope.users = users;
            $scope.password = DemoEnvPassword;
          }
        }
      });
  });
