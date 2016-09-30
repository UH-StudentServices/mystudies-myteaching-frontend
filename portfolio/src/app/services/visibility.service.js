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

angular.module('services.visibility', ['services.portfolio', 'resources.visibility'])

  .constant('Visibility', {
    PRIVATE: 'PRIVATE',
    PUBLIC: 'PUBLIC'
  })

  .factory('VisibilityService', function($q, PortfolioService, VisibilityResource, Visibility) {
    function componentVisibilitySearchCriteria(componentId, section) {
      var searchCriteria = {};

      if (componentId) {
        searchCriteria.component = componentId;
      }

      if (section) {
        searchCriteria.teacherPortfolioSection = section;
      }

      return searchCriteria;
    }

    function createComponentPermission(componentId, section, visibility) {
      return _.assign(componentVisibilitySearchCriteria(componentId, section), {visibility: visibility});
    }

    function getComponentVisibility(componentId, section) {
      return PortfolioService.getPortfolio()
        .then(function(portfolio) {
          return _.find(portfolio.componentVisibilities,
            componentVisibilitySearchCriteria(componentId, section));
        })
        .then(function(visibility) {
          return _.get(visibility, 'visibility', Visibility.PRIVATE);
        });
    }

    function insertOrUpdateComponentVisibility(componentId, section, visibility, portfolio) {
      var visibilityToUpdate = _.find(portfolio.componentVisibilities,
        componentVisibilitySearchCriteria(componentId, section));

      if (!visibilityToUpdate) {
        portfolio.componentVisibilities.push(
          createComponentPermission(componentId, section, visibility));
      } else {
        visibilityToUpdate.visibility = visibility;
      }

      return visibility;
    }

    function setComponentVisibility(componentId, section, visibility) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        return VisibilityResource
          .setComponentVisibility(portfolio.id,
            createComponentPermission(componentId, section, visibility))
          .then(_.partial(
            insertOrUpdateComponentVisibility, componentId, section, visibility, portfolio));
      });
    }

    return {
      getComponentVisibility: getComponentVisibility,
      setComponentVisibility: setComponentVisibility
    };
  });
