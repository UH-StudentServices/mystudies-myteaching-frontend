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

angular.module('resources.profileFiles', [])

  .constant('ProfileFilesResourcePath', '/api/private/v1/profile/files')

  .factory('ProfileFilesResource', function ($resource, $http, ProfileFilesResourcePath) {
    function browseFilesResource(path) {
      var browseFilesResourcePath = ProfileFilesResourcePath;

      return $resource(browseFilesResourcePath, {}, {
        getFileList: {
          method: 'GET',
          isArray: true,
          url: browseFilesResourcePath
        },
        deleteFile: {
          method: 'DELETE',
          url: browseFilesResourcePath + '/' + path
        }
      });
    }

    function getFileList() {
      return browseFilesResource().getFileList().$promise;
    }

    function deleteFile(file) {
      return browseFilesResource(file).deleteFile().$promise;
    }

    function saveFile(file) {
      var formData = new FormData();

      formData.append('upload', file);

      return $http({
        url: ProfileFilesResourcePath,
        headers: { 'Content-Type': undefined },
        data: formData,
        method: 'POST'
      });
    }

    return {
      getFileList: getFileList,
      deleteFile: deleteFile,
      saveFile: saveFile
    };
  });
