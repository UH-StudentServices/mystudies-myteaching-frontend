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
                                          Role,
                                          SessionService,
                                          localStorageService,
                                          StateService,
                                          State) {
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
        if(stateChangeAvailable) {
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
      switch (state) {
        case State.MY_TEACHINGS:
          localStorageService.cookie.set('SESSION_ROLE', Role.TEACHER);
          changeView(State.MY_TEACHINGS);
          break;
        case State.MY_STUDIES:
          localStorageService.cookie.set('SESSION_ROLE', Role.STUDENT);
          changeView(State.MY_STUDIES);
          break;
        default:
          localStorageService.cookie.set('SESSION_ROLE', Role.STUDENT);
          changeView(State.MY_STUDIES);
          break;
      }
    }

    function changeState() {
      changeStateAvailableTo().then(function(state) {
        if(state) {
          changeStateTo(state);
        }
      });
    }

    return {
      changeStateAvailableTo: changeStateAvailableTo,
      changeState: changeState
    };
  });
