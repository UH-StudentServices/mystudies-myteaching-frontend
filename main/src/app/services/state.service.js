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

angular.module('services.state', [
  'services.session',
  'services.configuration'
])

  .constant('State', {
    MY_STUDIES: 'opintoni',
    MY_TEACHINGS: 'opetukseni',
    ADMIN: 'admin',
    ACCESS_DENIED: 'accessDenied',
    ERROR: 'error',
    LOCAL_LOGIN: 'localLogin',
    LANDER: 'login'
  })

  .factory('StateService', function ($state, $location, State, Configuration, Role, ConfigurationProperties) {
    var stateMatches = function (state, name) {
      if (state === name || state.name === name) {
        return true;
      } if (state.parent) {
        return stateMatches(state.parent, name);
      }
      return false;
    };

    var currentOrParentStateMatches = function (stateToMatch) {
      return stateMatches($state.current, stateToMatch);
    };

    var getRootStateName = function getRootStateName() {
      var rootStateName = '';

      if (stateMatches($state.current, State.MY_STUDIES)) {
        rootStateName = State.MY_STUDIES;
      } else if (stateMatches($state.current, State.MY_TEACHINGS)) {
        rootStateName = State.MY_TEACHINGS;
      } else if (stateMatches($state.current, State.ADMIN)) {
        rootStateName = State.ADMIN;
      }

      return rootStateName;
    };

    var getDefaultStateForUser = function getDefaultStateForUser(session) {
      var defaultRole = _.first(session.roles);

      if (defaultRole === Role.TEACHER) {
        return State.MY_TEACHINGS;
      } if (defaultRole === Role.STUDENT) {
        return State.MY_STUDIES;
      }
      return State.ACCESS_DENIED;
    };

    function configurationPropertyContains(property, expectedValue) {
      return Configuration[property] && Configuration[property].indexOf(expectedValue) > -1;
    }
    // eslint-disable-next-line vars-on-top
    var getStateFromDomain = function getStateFromDomain() {
      var host = $location.host();

      if (configurationPropertyContains(ConfigurationProperties.STUDENT_APP_URL, host)) {
        return State.MY_STUDIES;
      } if (configurationPropertyContains(ConfigurationProperties.TEACHER_APP_URL, host)) {
        return State.MY_TEACHINGS;
      }
      throw Error('hostname does not match any configured values');
    };

    return {
      getRootStateName: getRootStateName,
      getStateFromDomain: getStateFromDomain,
      getDefaultStateForUser: getDefaultStateForUser,
      currentOrParentStateMatches: currentOrParentStateMatches
    };
  });
