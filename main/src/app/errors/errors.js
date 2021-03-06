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

angular.module('opintoniErrors', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('error', {
        abstract: true,
        parent: 'getState',
        url: '/error',
        views: {
          'content@': {
            templateUrl: 'app/partials/errorPages/_error.html',
            controller: [
              '$scope', 'pageHeaderLinks', 'state',
              function ($scope, pageHeaderLinks, state) {
                $scope.pageHeaderLinks = pageHeaderLinks;
                $scope.currentStateName = state;
              }
            ]
          }
        }
      })
      .state('accessDenied', {
        parent: 'error',
        url: '/accessdenied',
        templateUrl: 'app/partials/errorPages/_error.accessdenied.html',
        controller: function ($scope, Configuration) {
          $scope.loginUrls = {
            loginUrlStudent: Configuration.loginUrlStudent,
            loginUrlTeacher: Configuration.loginUrlTeacher
          };
        }
      })
      .state('maintenance', {
        parent: 'error',
        url: '/maintenance',
        templateUrl: 'app/partials/errorPages/_error.maintenance.html'
      });
  });
