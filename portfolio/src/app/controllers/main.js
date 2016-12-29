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

angular.module('controllers.main', ['constants.portfolioTabs'])
  .controller('MainCtrl', function($scope, portfolioTabs, portfolio, userSettings) {
    $scope.portfolio = portfolio;
    $scope.userSettings = userSettings;
    $scope.portfolioTabs = portfolioTabs;
    $scope.currentYear = moment().year();

    document.title = portfolio.ownerName;
  });
