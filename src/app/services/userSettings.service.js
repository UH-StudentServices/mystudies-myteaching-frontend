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

angular.module('services.userSettings', ['resources.userSettings'])

  .factory('UserSettingsService', function(UserSettingsResource) {

    var settingsPromise;
    var availableBackgroundsPromise;

    function getUserSettings() {
      if (!settingsPromise) {
        settingsPromise = UserSettingsResource.getUserSettings();
      }

      return settingsPromise;
    }

    function reloadUserSettings() {
      settingsPromise = UserSettingsResource.getUserSettings();
      return settingsPromise;
    }

    function getAvailableBackgrounds() {
      if (!availableBackgroundsPromise) {
        availableBackgroundsPromise = UserSettingsResource.getAvailableBackgrounds();
      }
      return availableBackgroundsPromise;
    }

    function selectUserBackground(filename) {
      return getUserSettings().then(function(settings) {
        settingsPromise = UserSettingsResource.selectUserBackground(settings.id, filename);
      });
    }

    function uploadUserBackground(imageBase64) {
      return getUserSettings().then(function(userSettings) {
        settingsPromise =  UserSettingsResource.uploadUserBackground(userSettings.id, imageBase64);
      });
    }

    function updateUserAvatar(imageBase64) {
      return getUserSettings().then(function(userSettings) {
        return UserSettingsResource.updateUserAvatar(userSettings.id, imageBase64);
      });
    }

    function deleteUserAvatar() {
      return getUserSettings().then(function(settings) {
        return UserSettingsResource.deleteUserAvatar(settings.id);
      });
    }

    function showMyStudiesTour() {
      return getUserSettings().then(function(settings) {
        return settings.showMyStudiesTour;
      });
    }

    function showMyTeachingTour() {
      return getUserSettings().then(function(settings) {
        return settings.showMyTeachingTour;
      });
    }

    function markStudentTourShown() {
      return getUserSettings().then(function(settings) {
        return UserSettingsResource.updateUserSettings(_.assign(settings,
          {showMyStudiesTour: false}));
      });
    }

    function markTeacherTourShown() {
      return getUserSettings().then(function(settings) {
        return UserSettingsResource.updateUserSettings(_.assign(settings,
          {showMyTeachingTour: false}));
      });
    }

    return {
      getUserSettings: getUserSettings,
      reloadUserSettings: reloadUserSettings,
      getAvailableBackgrounds: getAvailableBackgrounds,
      selectUserBackground: selectUserBackground,
      uploadUserBackground: uploadUserBackground,
      updateUserAvatar: updateUserAvatar,
      deleteUserAvatar: deleteUserAvatar,
      showMyStudiesTour: showMyStudiesTour,
      showMyTeachingTour: showMyTeachingTour,
      markStudentTourShown: markStudentTourShown,
      markTeacherTourShown: markTeacherTourShown
    };
  });
