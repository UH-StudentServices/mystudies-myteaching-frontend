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

angular.module('directives.searchBar', [
  'services.search',
  'services.message',
  'ui.bootstrap.typeahead',
  'uib/template/typeahead/typeahead-popup.html',
  'directives.focus'
])
  .directive('searchBar', function($document, SearchService, MessageService,
                                   SearchEvents, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/search/searchBar/searchBar.html',
      scope: {},
      link: function($scope, element) {

        $scope.active = false;
        element.data('thisElement', true);

        MessageService.subscribe($scope, SearchEvents.TOGGLE_SEARCH_CLICKED, function(active) {
          if (active) {
            $scope.active = true;
          } else {
            $scope.setInactive();
          }
        });

        $scope.search = function() {
          if (!_.isEmpty($scope.searchTerm)) {
            AnalyticsService.trackSearch();
            MessageService.broadcast(SearchEvents.SEARCH_TERM_ENTERED, $scope.searchTerm);
          }
        };

        $scope.getCategoryTitles = function(searchTerm) {
          return SearchService.searchCategory(searchTerm);
        };

        $scope.setInactive = function() {
          $scope.searchTerm = '';
          $scope.active = false;
        };

        $scope.clear = function() {
          if (!$scope.searchTerm) {
            MessageService.broadcast(SearchEvents.TOGGLE_SEARCH_CLICKED, false);
          }
          $scope.searchTerm = '';
        };
      }
    };
  });
