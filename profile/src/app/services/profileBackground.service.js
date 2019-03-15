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

angular.module('services.profileBackground', ['resources.profileBackground', 'services.profile'])

  .factory('ProfileBackgroundService', function (ProfileBackgroundResource, ProfileService) {
    function getProfileId() {
      return ProfileService.getProfile()
        .then(function (profile) {
          return profile.id;
        });
    }

    function selectProfileBackground(filename) {
      return getProfileId().then(function (profileId) {
        return ProfileBackgroundResource.selectProfileBackground(profileId, filename);
      });
    }

    function getProfileBackgroundUri() {
      return getProfileId().then(function (profileId) {
        return ProfileBackgroundResource.getProfileBackground(profileId);
      });
    }

    function uploadUserBackground(imageBase64) {
      return getProfileId().then(function (profileId) {
        return ProfileBackgroundResource.uploadUserBackground(profileId, imageBase64);
      });
    }

    return {
      selectProfileBackground: selectProfileBackground,
      getProfileBackgroundUri: getProfileBackgroundUri,
      uploadUserBackground: uploadUserBackground
    };
  });
