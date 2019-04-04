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
  'services.session',
  'services.userSettings',
  'services.configuration',
  'ngCookies'
])

  .factory('LoginService', function ($q,
    $window,
    $http,
    $httpParamSerializerJQLike,
    $state,
    $injector,
    $cookies,
    $translate,
    SessionService,
    UserSettingsService,
    StateService,
    State,
    Configuration,
    LocalPassword,
    LoginCookie,
    Environments) {
    var FEDERATED_LOGIN_ENVS = [Environments.QA, Environments.PROD];
    var isFederatedLoginEnv = FEDERATED_LOGIN_ENVS.indexOf(Configuration.environment) > -1;

    function loginPathForState(state) {
      var loginUrl = state === State.MY_TEACHINGS
        ? Configuration.loginUrlTeacher
        : Configuration.loginUrlStudent;

      var appUrl = state === State.MY_TEACHINGS
        ? Configuration.teacherAppUrl
        : Configuration.studentAppUrl;

      return loginUrl.replace(appUrl, '');
    }

    function goToStateOrRedirectOut(url) {
      var $state = $injector.get('$state'); // eslint-disable-line no-shadow
      var allStates = $state.get();
      var stateMatch;

      stateMatch = _.find(allStates, function (el) {
        return $state.href(el.name) === url;
      });

      if (stateMatch) {
        $state.go(stateMatch.name);
      } else {
        $window.location.href = url;
      }
    }

    function isFirstLogin() {
      return !$cookies.get(LoginCookie);
    }

    function shouldShowLander() {
      return isFederatedLoginEnv && isFirstLogin();
    }

    function goToLander() {
      $state.go(State.LANDER);
    }

    function goToLogin() {
      var state = StateService.getStateFromDomain();
      var loginPath = loginPathForState(state);

      goToStateOrRedirectOut(loginPath);
    }

    function goToLoginOrLander() {
      if (shouldShowLander()) {
        goToLander();
      } else {
        goToLogin();
      }
    }

    function reloadUserData() {
      return $q.all([
        SessionService.getSession(true),
        UserSettingsService.getUserSettings(true)
      ]);
    }

    function logInAs(username) {
      $http.post('/login', $httpParamSerializerJQLike({
        username: username,
        password: LocalPassword
      }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(reloadUserData)
        .then(StateService.getStateFromDomain)
        .then($state.go)
        .catch(_.partial($state.go, State.ACCESS_DENIED));
    }

    return {
      goToLogin: goToLogin,
      goToLoginOrLander: goToLoginOrLander,
      logInAs: logInAs
    };
  });
