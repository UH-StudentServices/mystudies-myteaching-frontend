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

angular.module('directives.pageBanner', [
  'directives.analytics',
  'services.news',
  'angular-flexslider',
  'dibari.angular-ellipsis',
  'ngAnimate'
])

  .directive('pageBanner', function($filter, NewsService, StateService) {
    return {
      restrict: 'E',
      replace: 'true',
      scope: {
        showBanner: '='
      },
      templateUrl: 'app/directives/pageBanner/pageBanner.html',
      link: function($scope) {

        $scope.currentStateName = StateService.getRootStateName();
        $scope.newsList = [];

        NewsService.getNews($scope.currentStateName).then(function(data) {
          $scope.newsList = data;
        });
      }
    };
  })

  .directive('pageBannerToggle', function($location, $anchorScroll, UserSettingsService, $translate) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        showBanner: '='
      },
      templateUrl: 'app/directives/pageBanner/pageBannerToggle.html',
      link: function($scope) {
        var hideTooltip = $translate.instant('banner.tooltip.hide'),
            showTooltip = $translate.instant('banner.tooltip.show');

        if ($scope.showBanner) {
          $scope.tooltip = hideTooltip;
        } else {
          $scope.tooltip = showTooltip;
        }

        $scope.toggleShowBanner = function() {
          UserSettingsService.setShowBanner(!$scope.showBanner);

          if (!$scope.showBanner) {
            $scope.tooltip = hideTooltip;
          } else {
            $scope.tooltip = showTooltip;

            $location.hash('top');
            $anchorScroll();
          }
        };
      }
    };
  });
