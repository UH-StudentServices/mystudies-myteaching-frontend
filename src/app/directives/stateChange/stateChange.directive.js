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

angular.module('directives.stateChange', [
  'services.state',
  'services.session'])

  .service('StateChangeService', function(Role, SessionService, $q,
                                          localStorageService, State, $window) {
    function isStateChangeAvailable() {
      var defer = $q.defer();

      SessionService.getSession().then(function getSessionSuccess(session) {
        if(session.roles.length > 1) {
          defer.resolve(true);
        } else {
          defer.resolve(false);
        }
      });

      return defer.promise;
    }

    function changeView(stateName) {
      $window.location = '/redirect?state=' + stateName;
    }

    function changeState(state) {
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

    return {
      isStateChangeAvailable: isStateChangeAvailable,
      changeState: changeState
    };
  })

  .directive('stateChange', function(StateChangeService) {
    return {
      restrict: 'A',
      link: function($scope) {
        $scope.changeState = StateChangeService.changeState;
      }
    };
  });
