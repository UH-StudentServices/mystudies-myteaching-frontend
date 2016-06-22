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
  'services.session'
])

  .constant('State', {
    MY_STUDIES: 'opintoni',
    MY_TEACHINGS: 'opetukseni',
    ADMIN: 'admin',
    ACCESS_DENIED: 'accessDenied'
  })

  .factory('StateService', function($state, $location, State, Configuration, Role) {

    var stateMatches = function(state, name) {
      if (state.name === name) {
        return true;
      } else if (state.parent) {
        return stateMatches(state.parent, name);
      } else {
        return false;
      }
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

    var getStateFromDomain = function getStateFromDomain() {
      var host = $location.host();

      if (configurationPropertyContains('studentAppUrl', host)) {
        return State.MY_STUDIES;
      } else if (configurationPropertyContains('teacherAppUrl', host)) {
        return State.MY_TEACHINGS;
      } else if (domainContainsString('student', host)) {
        return State.MY_STUDIES;
      } else if (domainContainsString('teacher', host)) {
        return State.MY_TEACHINGS;
      } else {
        return undefined;
      }
    };

    function domainContainsString(stringToFind, host) {
      return host.indexOf(stringToFind) > -1;
    }

    function configurationPropertyContains(property, expectedValue) {
      return Configuration[property] && Configuration[property].indexOf(expectedValue) > -1;
    }

    var getDefaultStateForUser = function getDefaultStateForUser(session) {
      var defaultRole = _.first(session.roles);

      if (defaultRole === Role.TEACHER) {
        return State.MY_TEACHINGS;
      } else if (defaultRole === Role.STUDENT) {
        return State.MY_STUDIES;
      } else {
        return State.ACCESS_DENIED;
      }
    };

    return {
      getRootStateName: getRootStateName,
      getStateFromDomain: getStateFromDomain,
      getDefaultStateForUser: getDefaultStateForUser
    };

  });
