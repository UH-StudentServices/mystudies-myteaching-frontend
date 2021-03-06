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

angular.module('services.state', ['services.profileRole'])
  .constant('State', {
    MY_STUDIES: 'opintoni',
    MY_TEACHINGS: 'opetukseni',
    PRIVATE: 'private',
    RESTRICTED: 'restricted',
    PUBLIC: 'public'
  })
  .factory('StateService', function (State, ProfileRoleService, $location) {
    var currentState = State.PUBLIC;
    var profileRole = ProfileRoleService.getActiveRole();

    function hasProfilePathInSessionDescriptor(session, lang, userpath) {
      if (session.profilePathsByRoleAndLang[profileRole]
        && session.profilePathsByRoleAndLang[profileRole][lang]) {
        return session.profilePathsByRoleAndLang[profileRole][lang][0] === ['', lang, userpath].join('/');
      }
      return false;
    }

    function resolve(session, lang, userpath) {
      if (session) {
        currentState = hasProfilePathInSessionDescriptor(session, lang, userpath)
          ? State.PRIVATE
          : State.RESTRICTED;
      }

      return currentState;
    }

    function getCurrent() {
      return currentState;
    }

    function getStateFromDomain() {
      var host = $location.host();

      if (host.indexOf('student') > -1) {
        return State.MY_STUDIES;
      }
      if (host.indexOf('teacher') > -1) {
        return State.MY_TEACHINGS;
      }
      throw Error('Unexpected hostname');
    }

    return {
      resolve: resolve,
      getCurrent: getCurrent,
      getStateFromDomain: getStateFromDomain
    };
  });
