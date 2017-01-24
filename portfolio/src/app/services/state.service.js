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

angular.module('services.state', ['services.session',
                                  'services.portfolioRole'])

  .constant('State', {
    'PRIVATE': 'private',
    'RESTRICTED': 'restricted',
    'PUBLIC': 'public'
  })

  .factory('StateService', function($location, State, PortfolioRoleService) {
    var currentState = State.PUBLIC,
        portfolioRole = PortfolioRoleService.getActiveRole();

    function resolve(session, lang) {
      if (session) {
        currentState = session.portfolioPathsByRoleAndLang[portfolioRole][lang][0] === $location.path() ?
          State.PRIVATE :
          State.RESTRICTED;
      }

      return currentState;
    }

    function getCurrent() {
      return currentState;
    }

    return {
      resolve: resolve,
      getCurrent: getCurrent
    };
  });
