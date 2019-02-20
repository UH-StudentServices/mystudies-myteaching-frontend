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

angular.module('directives.clipboard', [])

  .directive('clipboard', function (BrowserUtil,
    $timeout) {
    return {
      rescrict: 'A',
      scope: {
        selector: '@clipboardValueSelector',
        successCallback: '=clipboardSuccessCallback',
        errorCallback: '=clipboardErrorCallback'
      },
      link: function ($scope, element) {
        element.attr('data-clipboard-target', $scope.selector);

        $timeout(function () {
          var clipboard = new ClipboardJS('#' + element.attr('id'));

          clipboard.on('success', function (e) {
            e.clearSelection();
            $scope.successCallback();
            $scope.$apply();
          });

          clipboard.on('error', function () {
            $scope.errorCallback();
            $scope.$apply();
          });
        }, 0);
      }
    };
  });
