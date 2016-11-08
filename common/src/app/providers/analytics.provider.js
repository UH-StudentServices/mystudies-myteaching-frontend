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

angular.module('provider.analytics.configuration', ['services.configuration'])
  .constant('TRACKER', {
    'MAIN': {
      'NAME': 'OOtracker',
      'ID': 'googleAnalyticsAccount'
    },
    'TEACHER': {
      'NAME': 'OOTeacher',
      'ID': 'googleAnalyticsAccountTeacher'
    },
    'STUDENT': {
      'NAME': 'OOStudent',
      'ID': 'googleAnalyticsAccountStudent'
    }
  })


  .provider('AnalyticsConfiguration', function getAnalyticsConfiguration(TRACKER, ConfigurationProvider) {
    function checkTracker(hostname, trackerConfig) {
      return window.location.hostname.indexOf(hostname) !== -1 && ConfigurationProvider.$get()[trackerConfig];
    }

    function addTracker(accountsArray, trackerId, trackerName) {
      accountsArray.push({
        tracker: ConfigurationProvider.$get()[trackerId],
        trackEvent: true,
        name: trackerName
      });
    }

    function getAccounts() {
      var accountsArray = [];

      if (window.configuration) {
        addTracker(accountsArray, TRACKER.MAIN.ID, TRACKER.MAIN.NAME);

        if (checkTracker('teacher', TRACKER.TEACHER.ID)) {
          addTracker(accountsArray, TRACKER.TEACHER.ID, TRACKER.TEACHER.NAME);
        } else if (checkTracker('student', TRACKER.STUDENT.ID)) {
          addTracker(accountsArray, TRACKER.STUDENT.ID, TRACKER.STUDENT.NAME);
        }
      }
      return accountsArray;
    }

    return {
      getAccounts: getAccounts,
      $get: function() {}
    };

  });
