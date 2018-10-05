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

angular.module('portfolioErrors', ['services.login'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        abstract: true,
        url: '/error',
        templateUrl: 'app/partials/errorPages/_error.html',
        controller: ['$scope', 'pageHeaderLinks', function ($scope, pageHeaderLinks) {
          $scope.pageHeaderLinks = pageHeaderLinks;
        }]
      })
      .state('notFound', {
        parent: 'error',
        url: '/notfound',
        templateUrl: 'app/partials/errorPages/_error.notFound.html'
      })
      .state('loginNeeded', {
        parent: 'error',
        url: '/loginNeeded',
        templateUrl: 'app/partials/errorPages/_error.loginNeeded.html',
        controller: function ($scope, $stateParams, Configuration, LoginService) {
          $scope.redirectToLogin = function redirectToLogin() {
            LoginService.goToLogin($stateParams.originalUrl);
          };
        },
        params: {
          originalUrl: null
        }
      })
      .state('maintenance', {
        parent: 'error',
        url: '/maintenance',
        templateUrl: 'app/partials/errorPages/_error.maintenance.html'
      });
  });
