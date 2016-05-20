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

angular.module('services.message', [])

  .constant('SearchEvents', {
    SEARCH_TERM_ENTERED: 'SEARCH_TERM_ENTERED',
    SEARCH: 'SEARCH',
    TOGGLE_SEARCH_CLICKED: 'TOGGLE_SEARCH_CLICKED',
    TOGGLE_SEARCH: 'TOGGLE_SEARCH'
  })

  .factory('MessageService', function($rootScope) {

    var broadcast = function broadcast(eventName, data) {
      $rootScope.$broadcast(eventName, data);
    };

    var subscribe = function subscribe($scope, eventName, callback) {
      $scope.$on(eventName, function(event, data) { callback(data); });
    };

    return {
      broadcast: broadcast,
      subscribe: subscribe
    };

  });