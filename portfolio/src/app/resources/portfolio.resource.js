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

  .factory('PortfolioResource', function($resource, StateService) {

    var findPortfolioResource = $resource('/api/:currentState/v1/portfolio/:portfolioRole/:path'),
        updatePortfolioResource =  $resource('/api/:currentState/v1/portfolio/:id', {id: '@id'}, {
          'update': {method: 'PUT'}
        });

    function find(portfolioRole, path) {
      return findPortfolioResource
        .get({currentState: StateService.getCurrent(), portfolioRole: portfolioRole, path: path}).$promise;
    }

    function update(portfolio) {
      return updatePortfolioResource
        .update({currentState: StateService.getCurrent()}, portfolio).$promise;
    }

    return {
      find: find,
      update: update
    };
  });