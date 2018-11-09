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

angular.module('directives.sharedLinks', [
  'services.sharedLinks',
  'ui.bootstrap.modal',
  'utils.browser',
  'directives.clipboard',
  'directives.dateTimeInput'
])

  .constant({
    MessageTimeouts: {
      SUCCESS: 1000,
      FAIL: 2000
    }
  })

  .directive('sharedLinks', function ($location, $uibModal, $timeout, SharedLinksService, MessageTimeouts, BrowserUtil) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/sharedLinks/sharedLinks.html',
      controller: function ($scope) {
        function loadSharedLinks() {
          SharedLinksService.get().then(function (sharedLinks) {
            $scope.sharedLinks = sharedLinks;
          });
        }

        $scope.newSharedLink = {};

        $scope.openSharedLinksDialog = function () {
          loadSharedLinks();
          $uibModal.open({
            templateUrl: 'shared-links-dialog.html',
            controller: 'SharedLinksController',
            scope: $scope,
            animation: false,
            windowClass: 'shared-links-dialog dialog'
          });
        };

        $scope.copyToClipboardSuccessCallback = function () {
          $scope.copyToClipboardSuccess = true;

          $timeout(function () {
            $scope.copyToClipboardSuccess = false;
          }, MessageTimeouts.SUCCESS);
        };

        $scope.copyToClipboardErrorCallback = function () {
          $scope.copyToClipboardFailMessageKeySuffix = BrowserUtil.isMac() ? 'Mac' : 'Other';
          $scope.copyToClipboardFail = true;

          $timeout(function () {
            $scope.copyToClipboardFail = false;
          }, MessageTimeouts.FAIL);
        };

        $scope.addNewSharedLink = function (form) {
          var newSharedLink = $scope.newSharedLink;

          if (form.$invalid) {
            return false;
          }

          SharedLinksService.create({ expiryDate: newSharedLink.expiryDate })
            .then(function (sharedLink) {
              $scope.sharedLinks.push(sharedLink);
              $scope.newSharedLink = {};
            });

          return true;
        };

        $scope.removeSharedLink = function (sharedLink) {
          SharedLinksService.remove(sharedLink.id).then(function () {
            _.remove($scope.sharedLinks, { id: sharedLink.id });
          });
        };
      }
    };
  })

  .controller('SharedLinksController', function ($scope, $uibModalInstance) {
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  });
