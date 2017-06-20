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

angular.module('services.componentOrder', ['resources.componentOrder'])

  .factory('ComponentOrderService', function(ComponentOrderResource) {

    function defaultComponentOrder() {
      return [
        {component: 'STUDIES'},
        {component: 'DEGREES'},
        {component: 'WORK_EXPERIENCE'},
        {component: 'SAMPLES'},
        {component: 'FREE_TEXT_CONTENT'},
        {component: 'ATTAINMENTS'},
        {component: 'LANGUAGE_PROFICIENCIES'},
        {component: 'FAVORITES'}
      ];
    }

    function getInitialComponentOrder(portfolio) {
      var componentOrders = portfolio.componentOrders.length ? portfolio.componentOrders : defaultComponentOrder();

      return _.sortBy(componentOrders, 'orderValue');
    }

    function updateComponentOrder(portfolioId, updatedComponents) {
      ComponentOrderResource.updateComponentOrder(portfolioId, {
        componentOrders: updatedComponents.map(function(el, i) {
          return {
            component: el.component,
            instanceName: el.instanceName,
            orderValue: i + 1
          };
        })
      });
    }

    return {
      getInitialComponentOrder: getInitialComponentOrder,
      updateComponentOrder: updateComponentOrder
    };
  });
