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

angular.module('services.profile', [
  'resources.profile',
  'services.profileRole'
])

  .factory('ProfileService', function (ProfileResource,
    ProfileRoleService) {
    var profilePromise;

    function findProfileByPath(state, lang, userpath) {
      profilePromise = ProfileResource.find(
        state,
        ProfileRoleService.getActiveRole(),
        lang,
        userpath
      );
      return profilePromise;
    }

    function findProfileBySharedLink(sharedLink) {
      profilePromise = ProfileResource.findBySharedLink(sharedLink);
      return profilePromise;
    }

    function createProfile(role, lang) {
      return ProfileResource.create(role, lang);
    }

    function updateProfile(profile) {
      profilePromise = ProfileResource.update(profile);
      return profilePromise;
    }

    function getProfile() {
      return profilePromise;
    }

    return {
      findProfileByPath: findProfileByPath,
      findProfileBySharedLink: findProfileBySharedLink,
      createProfile: createProfile,
      updateProfile: updateProfile,
      getProfile: getProfile
    };
  });
