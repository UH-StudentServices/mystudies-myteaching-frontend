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

angular.module('provider.analyticsAccounts', ['services.configuration'])
  .constant('Tracker', {
    'main': {
      'NAME': 'OOtracker',
      'ID': 'googleAnalyticsAccount'
    },
    'teacher': {
      'NAME': 'OOTeacher',
      'ID': 'googleAnalyticsAccountTeacher'
    },
    'student': {
      'NAME': 'OOStudent',
      'ID': 'googleAnalyticsAccountStudent'
    }
  })


  .provider('AnalyticsAccounts', function getAnalyticsAccounts(Tracker, ConfigurationProvider) {
    var configuration = ConfigurationProvider.$get();

    function checkTracker(hostname, trackerConfig) {
      return window.location.hostname.indexOf(hostname) !== -1 && configuration[trackerConfig];
    }

    function addTracker(accountsArray, trackerId, trackerName) {
      accountsArray.push({
        tracker: configuration[trackerId],
        trackEvent: true,
        name: trackerName
      });
    }

    function getAccounts() {
      var accountsArray = [];

      if (window.configuration) {
        addTracker(accountsArray, Tracker.main.ID, Tracker.main.NAME);

        if (checkTracker('teacher', Tracker.teacher.ID)) {
          addTracker(accountsArray, Tracker.teacher.ID, Tracker.teacher.NAME);
        } else if (checkTracker('student', Tracker.student.ID)) {
          addTracker(accountsArray, Tracker.student.ID, Tracker.student.NAME);
        }
      }
      return accountsArray;
    }

    return {
      $get: getAccounts
    };

  });
