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

angular.module('directives.searchResults', [
  'services.search',
  'services.message',
  'filters.search'])

  .directive('searchResults', function(
    $filter, SearchEvents, SearchService, MessageService, SearchResultSource) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/header/userMenu/search/searchResults/searchResults.html',
      scope: {},
      link: function($scope) {

        $scope.showResults = false;

        $scope.resultsBySource = {};

        $scope.selectedCategory;

        MessageService.subscribe($scope, SearchEvents.SEARCH_TERM_ENTERED, function(searchTerm) {
          $scope.showResults = true;
          SearchService.search(searchTerm).then(function(results) {
            $scope.resultsBySource['ALL'] = results;
            _.forOwn(SearchResultSource, function(value, key) {
              $scope.resultsBySource[key] = $filter('fromSearchResultSource')(results, value);
            });
            $scope.results = $scope.resultsBySource['ALL'];
            $scope.selectedCategory = 'ALL';
          });
        });

        $scope.categories = function categories() {
          return Object.keys($scope.resultsBySource);
        }

        $scope.categoryClasses = function categoryClasses(category) {
          return {
            active: $scope.selectedCategory === category,
            clickable: $scope.selectedCategory !== category
          };
        }

        $scope.selectCategory = function selectCategory(category) {
          $scope.selectedCategory = category;
          $scope.results = $scope.resultsBySource[category];
        }

        $scope.close = function() {
          $scope.showResults = false;
          MessageService.broadcast(SearchEvents.TOGGLE_SEARCH_CLICKED, false);
        };

        MessageService.subscribe($scope, SearchEvents.TOGGLE_SEARCH_CLICKED, function(active) {
          if (!active) {
            $scope.showResults = false;
          }
        });
      }
    }
  });