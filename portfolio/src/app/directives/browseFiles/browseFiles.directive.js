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

angular.module('directives.browseFiles', ['services.portfolioFiles', 'ui.bootstrap.modal'])

  .constant('PortfolioPublicFilesResourcePath', '/api/public/v1/profile/files')

  .directive('browseFiles', function ($location, $uibModal, PortfolioFilesService, VerificationDialog) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/browseFiles/browseFiles.html',
      controller: function ($scope) {
        function loadFileList() {
          PortfolioFilesService.getFileList().then(function (res) {
            $scope.files = res.map(function (resource) { return resource.name; });
          });
        }

        $scope.openFileDialog = function () {
          loadFileList();
          $uibModal.open({
            templateUrl: 'browse-files-dialog.html',
            controller: 'BrowseFilesController',
            scope: $scope,
            animation: false,
            windowClass: 'file-dialog dialog'
          });
        };

        $scope.deleteFile = function (file) {
          function deleteItem() {
            PortfolioFilesService.deleteFile(file).then(function () { loadFileList($scope); });
          }

          VerificationDialog.open('general.reallyDelete', 'general.ok', 'general.cancel', deleteItem, function () {});
        };
      }
    };
  })

  .controller('BrowseFilesController', function ($scope, $uibModalInstance, PortfolioPublicFilesResourcePath) {
    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.onSelect = function (file) {
      var baseUrl = window.location.origin + PortfolioPublicFilesResourcePath;
      var filename = file.split('/')[1];

      $scope.fileSelected(baseUrl + '/' + file, filename);
      $uibModalInstance.dismiss();
    };
  });
