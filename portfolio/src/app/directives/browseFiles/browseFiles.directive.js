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

angular.module('directives.browseFiles', ['services.browseFiles'])

  .directive('browseFiles', function($location, BrowseFilesService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/browseFiles/browseFiles.html',
      link: function($scope) {
        BrowseFilesService.getFileList().then(function(res) {
          $scope.files = res.map(function(resource) { return resource.name; });
        });

        $scope.fileSelected = function(file) {
          var baseUrl = window.location.origin + '/api/private/v1/portfolio/files/';

          window.opener.CKEDITOR.tools.callFunction($location.search().CKEditorFuncNum, baseUrl + file);
          window.close();
        };
      }
    };
  });
