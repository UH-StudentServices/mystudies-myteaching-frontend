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
    function componentVisibilitySearchCriteria(visibilityDescriptor) {
      var searchCriteria = {};

      searchCriteria.component = visibilityDescriptor.componentId || null;
      searchCriteria.teacherPortfolioSection = visibilityDescriptor.sectionName || null;
      searchCriteria.instanceName = visibilityDescriptor.instanceName || null;

      return searchCriteria;
    }

    function createComponentPermission(visibilityDescriptor, visibility) {
      return _.assign(componentVisibilitySearchCriteria(visibilityDescriptor), {visibility: visibility});
    }

    function getComponentVisibility(visibilityDescriptor) {
      return PortfolioService.getPortfolio()
        .then(function(portfolio) {
          return _.find(portfolio.componentVisibilities,
            componentVisibilitySearchCriteria(visibilityDescriptor));
        })
        .then(function(visibility) {
          return _.get(visibility, 'visibility', Visibility.PRIVATE);
        });
    }

    function insertOrUpdateComponentVisibility(visibilityDescriptor, visibility, portfolio) {
      var visibilityToUpdate = _.find(portfolio.componentVisibilities,
        componentVisibilitySearchCriteria(visibilityDescriptor));

      if (!visibilityToUpdate) {
        portfolio.componentVisibilities.push(
          createComponentPermission(visibilityDescriptor, visibility));
      } else {
        visibilityToUpdate.visibility = visibility;
      }

      return visibility;
    }

    function setComponentVisibility(visibilityDescriptor, visibility) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        return VisibilityResource
          .setComponentVisibility(portfolio.id,
            createComponentPermission(visibilityDescriptor, visibility))
          .then(_.partial(
            insertOrUpdateComponentVisibility, visibilityDescriptor, visibility, portfolio));
      });
    }

    return {
      getComponentVisibility: getComponentVisibility,
      setComponentVisibility: setComponentVisibility
    };
  });
