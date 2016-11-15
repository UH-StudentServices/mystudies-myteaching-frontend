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

angular.module('services.stateChange', [
  'services.state',
  'services.session'])

  .factory('StateChangeService', function($q,
                                          $window,
                                          $http,
                                          $httpParamSerializerJQLike,
                                          $state,
                                          Role,
                                          SessionService,
                                          UserSettingsService,
                                          localStorageService,
                                          StateService,
                                          State,
                                          $injector,
                                          Configuration,
                                          ConfigurationProperties,
                                          LocalPassword) {
    function isStateChangeAvailable() {
      return SessionService.getSession()
        .then(function getSessionSuccess(session) {
          return _.every(
            [Role.TEACHER, Role.STUDENT],
            _.partial(_.includes, session.roles));
        })
        .catch(function() {
          return false;
        });
    }

    function changeStateAvailableTo() {
      return isStateChangeAvailable().then(function(stateChangeAvailable) {
        if (stateChangeAvailable) {
          return StateService.getRootStateName() === State.MY_STUDIES ?
            State.MY_TEACHINGS :
            State.MY_STUDIES;
        } else {
          return null;
        }
      });
    }

    function changeView(stateName) {
      $window.location = '/redirect?state=' + stateName;
    }

    function changeStateTo(state) {
      var targetState = state || State.MY_STUDIES;

      changeView(targetState);
    }

    function changeState() {
      changeStateAvailableTo().then(function(state) {
        if (state) {
          changeStateTo(state);
        }
      });
    }

    function loginPathForState(state) {
      var loginUrl = state === State.MY_TEACHINGS ? Configuration.loginUrlTeacher : Configuration.loginUrlStudent,
          appUrl = state === State.MY_TEACHINGS ? Configuration.teacherAppUrl : Configuration.studentAppUrl;

      return loginUrl.replace(appUrl, '');
    }

    function goToStateOrRedirectOut(url) {
      var $state = $injector.get('$state'),
          allStates = $state.get(),
          stateMatch;

      stateMatch = _.find(allStates, function(el) {
        return $state.href(el.name) === url;
      });

      if (stateMatch) {
        $state.go(stateMatch.name);
      } else {
        $window.location.href = url;
      }
    }

    function goToLogin() {
      var state = StateService.getStateFromDomain(),
          loginPath = loginPathForState(state);

      goToStateOrRedirectOut(loginPath);
    }

    function reloadUserData() {
      return $q.all([SessionService.getSession(true), UserSettingsService.getUserSettings(true)]);
    }

    function logInAs(username) {
      $http.post('/login', $httpParamSerializerJQLike({
        username: username,
        password: LocalPassword
      }), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
        .then(reloadUserData)
        .then(StateService.getStateFromDomain)
        .then($state.go)
        .catch(_.partial($state.go, State.ACCESS_DENIED));
    }

    return {
      changeStateAvailableTo: changeStateAvailableTo,
      changeState: changeState,
      goToLogin: goToLogin,
      logInAs: logInAs
    };
  });
