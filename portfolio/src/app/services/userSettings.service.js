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

    var userSettingsPromise;

    function getUserSettings() {
      if(!userSettingsPromise) {
        userSettingsPromise = UserSettingsResource.getUserSettings();
      }
      return userSettingsPromise;
    }

    function updateUserSettings(userSettings) {
      userSettingsPromise = UserSettingsResource.updateUserSettings(userSettings);
      return userSettingsPromise;
    }

    function showPortfolioTour() {
      return getUserSettings().then(function(userSettings) {
        return userSettings.showPortfolioTour;
      });
    }

    function markPortfolioTourAsShown() {
      return getUserSettings().then(function(userSettings) {
        userSettings.showPortfolioTour = false;
        return updateUserSettings(userSettings);
      });
    }

    return {
      getUserSettings: getUserSettings,
      updateUserSettings: updateUserSettings,
      showPortfolioTour: showPortfolioTour,
      markPortfolioTourAsShown: markPortfolioTourAsShown
    };

  });