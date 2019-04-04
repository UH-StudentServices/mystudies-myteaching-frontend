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

angular.module('services.login', [
  'services.state',
  'services.configuration',
  'ngCookies'
])

  .factory('LoginService', function ($window,
    $cookies,
    StateService,
    State,
    Configuration,
    RedirectCookie) {
    function goToLogin(originalUrl) {
      var state = StateService.getStateFromDomain();
      var loginUrl = state === State.MY_TEACHINGS
        ? Configuration.loginUrlTeacherProfile
        : Configuration.loginUrlStudentProfile;

      $cookies.put(RedirectCookie.NAME, originalUrl,
        { expires: moment().add(RedirectCookie.TIMEOUT_IN_MINUTES, 'minutes').toDate() });

      $window.location.href = loginUrl;
    }

    return { goToLogin: goToLogin };
  });
