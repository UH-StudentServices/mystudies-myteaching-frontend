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

angular.module('services.componentHeadingService', ['resources.componentHeading', 'services.portfolio'])

  .factory('ComponentHeadingService', function(PortfolioService, ComponentHeadingResource, $translate) {
    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(_.property('id'));
    }

    function updateHeading(component) {
      return getPortfolioId().then(function(portfolioId) {
        return ComponentHeadingResource.updateHeading(portfolioId, component);
      });
    }

    function getComponentHeading(componentId) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        return _.find(portfolio.headings, {component: componentId});
      });
    }

    function getDefaultHeading(componentId, i18nKey, lang) {
      return {component: componentId, heading: $translate.instant(i18nKey, {}, '', lang)};
    }

    return {
      updateHeading: updateHeading, getComponentHeading: getComponentHeading, getDefaultHeading: getDefaultHeading
    };

  });