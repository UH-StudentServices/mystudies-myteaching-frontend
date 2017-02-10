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

angular.module('services.userSettings', ['resources.userSettings', 'services.configuration'])

  .constant('DemoTourCookie', {
    TEACHER: 'OODemoTourTeacher',
    STUDENT: 'OODemoTourStudent'
  })

  .factory('UserSettingsService', function($q, $cookies, DemoTourCookie, UserSettingsResource, Configuration, Environments) {

    var settingsPromise,
        availableBackgroundsPromise,
        Rx = window.Rx,
        userSettingsSubject = new Rx.BehaviorSubject(),
        showBannerSubject = userSettingsSubject.map(function(userSettings) {
          return userSettings.showBanner;
        });

    function publishUserSettings(userSettings) {
      userSettingsSubject.onNext(userSettings);
      return userSettings;
    }

    function getUserSettings(forceRefresh) {
      if (!settingsPromise || forceRefresh) {
        settingsPromise = UserSettingsResource
          .getUserSettings()
          .then(publishUserSettings);
      }

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
        settingsPromise =
          UserSettingsResource.selectUserBackground(settings.id, filename)
            .then(publishUserSettings);
        return settingsPromise;
      });
    }

    function uploadUserBackground(imageBase64) {
      return getUserSettings().then(function(userSettings) {
        settingsPromise =
          UserSettingsResource.uploadUserBackground(userSettings.id, imageBase64)
            .then(publishUserSettings);
        return settingsPromise;
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
      if (Configuration.environment === Environments.DEMO) {
        if ($cookies.get(DemoTourCookie.STUDENT)) {
          return $q.resolve(false);
        } else {
          return $q.resolve(true);
        }
      } else {
        return getUserSettings().then(function(settings) {
          return settings.showMyStudiesTour;
        });
      }
    }

    function showMyTeachingTour() {
      if (Configuration.environment === Environments.DEMO) {
        if ($cookies.get(DemoTourCookie.TEACHER)) {
          return $q.resolve(false);
        } else {
          return $q.resolve(true);
        }
      } else {
        return getUserSettings().then(function(settings) {
          return settings.showMyTeachingTour;
        });
      }
    }

    function updateUserSettings(updateObject) {
      settingsPromise = getUserSettings()
        .then(function(settings) {
          return UserSettingsResource.updateUserSettings(_.assign(settings, updateObject));
        })
        .then(publishUserSettings);

      return settingsPromise;
    }

    function putDemoTourInfoToCookie(cookieName) {
      $cookies.put(cookieName, true);
    }

    function markStudentTourShown() {
      if (Configuration.environment === Environments.DEMO) {
        putDemoTourInfoToCookie(DemoTourCookie.STUDENT);
      } else {
        return updateUserSettings({showMyStudiesTour: false});
      }
    }

    function markTeacherTourShown() {
      if (Configuration.environment === Environments.DEMO) {
        putDemoTourInfoToCookie(DemoTourCookie.TEACHER);
      } else {
        return updateUserSettings({showMyTeachingTour: false});
      }
    }

    function setShowBanner(showBanner) {
      return updateUserSettings({showBanner: showBanner});
    }

    function getShowBannerSubject() {
      return showBannerSubject;
    }

    function acceptCookies() {
      return updateUserSettings({cookieConsent: true});
    }

    return {
      acceptCookies: acceptCookies,
      getUserSettings: getUserSettings,
      getAvailableBackgrounds: getAvailableBackgrounds,
      selectUserBackground: selectUserBackground,
      uploadUserBackground: uploadUserBackground,
      updateUserAvatar: updateUserAvatar,
      deleteUserAvatar: deleteUserAvatar,
      showMyStudiesTour: showMyStudiesTour,
      showMyTeachingTour: showMyTeachingTour,
      markStudentTourShown: markStudentTourShown,
      markTeacherTourShown: markTeacherTourShown,
      setShowBanner: setShowBanner,
      getShowBannerSubject: getShowBannerSubject
    };
  });
