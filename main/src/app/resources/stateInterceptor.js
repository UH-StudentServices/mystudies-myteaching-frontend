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

angular.module('resources.stateInterceptor', [
  'services.session',
  'services.state',
  'services.login'
])

  .run(function ($rootScope, $state, SessionService, State, LoginService) {
    function authorizeState(stateRoles) {
      return SessionService.isInAnyRole(stateRoles);
    }

    function isLoginOrLander(targetState) {
      return [State.LOCAL_LOGIN, State.LANDER].indexOf(targetState.name) > -1;
    }

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!isLoginOrLander(toState)) {
        SessionService.getSession().then(function () {
          if (toState.data && toState.data.roles) {
            return authorizeState(toState.data.roles);
          }

          return true;
        }).then(function (authorized) {
          if (!authorized) {
            $state.go(State.ACCESS_DENIED);
          }
        }).catch(LoginService.goToLoginOrLander);
      }
    });
  });
