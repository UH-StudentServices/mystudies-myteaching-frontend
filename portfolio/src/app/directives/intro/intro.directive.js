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

angular.module('directives.intro', [
  'services.portfolio',
  'services.portfolioBackground',
  'directives.editLink',
  'directives.chooseBackground',
  'angular-flexslider',
  'ngFileUpload',
  'portfolioAnalytics'
])

  .constant('backgroundChangeEvent', 'backgroundChange')

  .directive('intro', function ($rootScope,
    PortfolioService,
    PortfolioBackgroundService,
    backgroundChangeEvent,
    AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/intro/intro.html',
      link: function ($scope) {
        function setBackgroundUri(data) {
          $scope.userBackgroundStyle = { 'background-image': 'url("' + data.backgroundUri + '")' };
        }

        function setBackgroundImage() {
          PortfolioService.getPortfolio().then(setBackgroundUri);
        }

        function updateBackgroundImage() {
          PortfolioBackgroundService.getPortfolioBackgroundUri().then(setBackgroundUri);
        }

        $scope.editing = false;

        PortfolioService.getPortfolio().then(function (portfolio) {
          $scope.portfolio = portfolio;
        });

        $scope.edit = function () {
          $scope.editing = true;
        };

        $scope.exitEdit = function () {
          AnalyticsService.trackEvent(AnalyticsService.ec.INTRO_TEXT, AnalyticsService.ea.SAVE);
          $scope.editing = false;
          PortfolioService.updatePortfolio($scope.portfolio).then(function (portfolio) {
            $scope.portfolio = portfolio;
          });
          return true;
        };

        $rootScope.$on(backgroundChangeEvent, updateBackgroundImage);

        setBackgroundImage();
      }
    };
  });
