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
    var prevArguments;
    var prevFunction;

    function setPrevCall(prevCallArguments, prevCallFunction) {
      prevArguments = prevCallArguments;
      prevFunction = prevCallFunction;
    }

    function refresh() {
      profilePromise = prevFunction.apply(null, prevArguments);
    }

    function findProfileByPath(state, lang, userpath) {
      profilePromise = ProfileResource.find(
        state,
        ProfileRoleService.getActiveRole(),
        lang,
        userpath
      );
      setPrevCall(arguments, findProfileByPath);
      return profilePromise;
    }

    function findProfileBySharedLink(sharedLink) {
      profilePromise = ProfileResource.findBySharedLink(sharedLink);
      setPrevCall(arguments, findProfileBySharedLink);
      return profilePromise;
    }

    function createProfile(role, lang) {
      return ProfileResource.create(role, lang);
    }

    function updateProfile(profile) {
      profilePromise = ProfileResource.update(profile);
      return profilePromise;
    }

    function getProfile(doRefresh) {
      if (doRefresh) {
        refresh();
      }
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
