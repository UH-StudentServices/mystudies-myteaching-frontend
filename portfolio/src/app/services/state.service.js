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

angular.module('services.state', [
  'services.session',
  'services.portfolioRole',
  'services.configuration'
])

  .constant('State', {
    MY_STUDIES: 'opintoni',
    MY_TEACHINGS: 'opetukseni',
    PRIVATE: 'private',
    RESTRICTED: 'restricted',
    PUBLIC: 'public'
  })

  .factory('StateService', function (State, PortfolioRoleService, Configuration, ConfigurationProperties, $location) {
    var currentState = State.PUBLIC;

    var portfolioRole = PortfolioRoleService.getActiveRole();

    function hasPortfolioPathInSessionDescriptor(session, lang, userpath) {
      if (session.portfolioPathsByRoleAndLang[portfolioRole]) {
        return session.portfolioPathsByRoleAndLang[portfolioRole][lang][0] === ['', lang, userpath].join('/');
      }
      return false;
    }

    function resolve(session, lang, userpath) {
      if (session) {
        currentState = hasPortfolioPathInSessionDescriptor(session, lang, userpath)
          ? State.PRIVATE
          : State.RESTRICTED;
      }

      return currentState;
    }

    function getCurrent() {
      return currentState;
    }

    function configurationPropertyContains(property, expectedValue) {
      return Configuration[property] && Configuration[property].indexOf(expectedValue) > -1;
    }

    function getStateFromDomain() {
      var host = $location.host();

      if (configurationPropertyContains(ConfigurationProperties.STUDENT_APP_URL, host)) {
        return State.MY_STUDIES;
      } if (configurationPropertyContains(ConfigurationProperties.TEACHER_APP_URL, host)) {
        return State.MY_TEACHINGS;
      }
      throw Error('hostname does not match any configured values');
    }

    return {
      resolve: resolve,
      getCurrent: getCurrent,
      getStateFromDomain: getStateFromDomain
    };
  });
