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

angular.module('resources.profileBackground', [])

  .factory('ProfileBackgroundResource', function ($resource, StateService) {
    function profileBackgroundResource(profileId) {
      var profileBackgroundUrl = '/api/' + StateService.getCurrent()
        + '/v1/profile/' + profileId + '/background';

      return $resource(profileBackgroundUrl, { id: '@id' }, {
        selectProfileBackground: {
          method: 'PUT',
          url: profileBackgroundUrl + '/select'
        },
        uploadProfileBackground: {
          method: 'PUT',
          url: profileBackgroundUrl + '/upload'
        },
        getProfileBackground: {
          method: 'GET',
          url: profileBackgroundUrl
        }
      });
    }

    function selectProfileBackground(profileId, filename) {
      return profileBackgroundResource(profileId)
        .selectProfileBackground({ filename: filename }).$promise;
    }

    function getProfileBackground(profileId) {
      return profileBackgroundResource(profileId).getProfileBackground().$promise;
    }

    function uploadUserBackground(profileId, imageBase64) {
      return profileBackgroundResource(profileId)
        .uploadProfileBackground({ imageBase64: imageBase64 }).$promise;
    }

    return {
      selectProfileBackground: selectProfileBackground,
      getProfileBackground: getProfileBackground,
      uploadUserBackground: uploadUserBackground
    };
  });
