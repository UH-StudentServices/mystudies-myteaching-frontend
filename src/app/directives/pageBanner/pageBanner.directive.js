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
  'services.news',
  'angular-flexslider',
  'dibari.angular-ellipsis'
])

  .directive('pageBanner', function($filter, NewsService, StateService, AnalyticsService) {
    return {
      restrict: 'E',
      replace: 'true',
      scope: {},
      templateUrl: 'app/directives/pageBanner/pageBanner.html',
      controller: function($scope) {

        $scope.currentStateName = StateService.getRootStateName();
        $scope.newsList = [];

        NewsService.getNews($scope.currentStateName).then(function(data) {
          $scope.newsList = data;
        });

        $scope.newsUrlClick = function() {
          AnalyticsService.trackFlammaNewsUrlClick();
        };

        this.setShowBanner = function(showBanner) {
          $scope.showBanner = showBanner;
        };
      }
    };
  })

  .directive('pageBannerToggle', function(UserSettingsService) {
    return {
      restrict: 'E',
      replace: true,
      require: '^^pageBanner',
      scope: {},
      templateUrl: 'app/directives/pageBanner/pageBannerToggle.html',
      link: function($scope, element, attrs, pageBannerCtrl) {

        function setShowBanner(showBanner) {
          $scope.showBanner = showBanner;
          pageBannerCtrl.setShowBanner(showBanner);
        }

        UserSettingsService.getUserSettings().then(function(userSettings) {
          setShowBanner(userSettings.showBanner);
        });

        $scope.toggleShowBanner = function() {
          var showBanner = !$scope.showBanner;

          UserSettingsService.setShowBanner(showBanner)
            .then(_.partial(setShowBanner, showBanner));
        };
      }
    };
  });
