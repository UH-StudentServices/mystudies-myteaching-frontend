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

angular.module('resources.portfolio', ['services.state'])

  .constant('PortfolioRole', {
    STUDENT : 'student',
    TEACHER : 'teacher'
  })

  .factory('PortfolioResource', function($resource, StateService, State, PortfolioRole) {
    var portfolioRole = StateService.getRootStateName() === State.MY_STUDIES ? PortfolioRole.STUDENT : PortfolioRole.TEACHER,
        portfolioResource = $resource('/api/private/v1/portfolio/' + portfolioRole);

    function createPortfolio() {
      return portfolioResource.save().$promise;
    }

    function getPortfolio() {
      return portfolioResource.get().$promise;
    }

    return {
      createPortfolio: createPortfolio,
      getPortfolio: getPortfolio
    };

  });
