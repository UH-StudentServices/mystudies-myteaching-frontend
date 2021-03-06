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

angular.module('directives.favorites.addNew', [
  'directives.favorites.addNew.rss',
  'directives.favorites.addNew.unicafe',
  'directives.favorites.addNew.twitter',
  'directives.favorites.addNew.link',
  'directives.favorites.addNew.flamma',
  'directives.popover',
  'services.focus'
])

  .constant('NewFavoriteAddedEvent', 'NEW_FAVORITE_ADDED')

  .directive('addNewFavoriteSearch', function () {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.addNew.search.html',
      replace: true,
      scope: {
        searchFn: '=',
        clearSearchFn: '=',
        enterFn: '=',
        searchString: '=',
        placeholder: '@',
        loading: '='
      },
      compile: function (tElement, tAttrs) {
        tElement.find('input').attr('type', tAttrs.inputType);

        return function ($scope) {
          $scope.search = _.debounce(function (searchString) {
            if ($scope.favoriteSearchForm.$valid && $scope.searchFn) {
              $scope.searchFn(searchString);
            }
          }, 1000);

          $scope.onKeyPress = function ($event) {
            if ($event.which === 13 && $scope.enterFn && $scope.favoriteSearchForm.$valid) {
              $scope.enterFn();
            }
          };
          $scope.save = function () {
            if ($scope.enterFn && $scope.favoriteSearchForm.$valid) {
              $scope.enterFn();
            }
          };
          $scope.clearSearch = function () {
            $scope.searchString = '';
            if ($scope.clearSearchFn) {
              $scope.clearSearchFn();
            }
          };
          $scope.$on('saveComponent', $scope.save);
        };
      }
    };
  })

  .directive('addNewFavorite', function (NewFavoriteAddedEvent, Focus) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/favorites.addNew.html',
      replace: true,
      scope: {
        favorites: '=',
        availableFavoriteTypes: '='
      },
      link: function ($scope) {
        $scope.favorite = {};
        $scope.displayPopover = false;

        function setFocus() {
          Focus.setFocus('.add-favorite-container button');
        }

        function resetPopover() {
          $scope.favorite = {};
        }

        $scope.togglePopover = function () {
          $scope.displayPopover = !$scope.displayPopover;

          if ($scope.displayPopover) {
            setFocus();
            resetPopover();
          }
        };

        $scope.closePopover = function () {
          $scope.displayPopover = false;
        };

        $scope.selectFavoriteType = function (favoriteType) {
          $scope.favorite.type = favoriteType;
          Focus.setFocus('.add-favorite-container input');
        };

        $scope.$on(NewFavoriteAddedEvent, function () {
          resetPopover();
        });
      }
    };
  });
