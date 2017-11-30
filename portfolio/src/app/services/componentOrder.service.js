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

angular.module('services.componentOrder', ['services.freeTextContent', 'resources.componentOrder'])

  .factory('ComponentOrderService', function(FreeTextContentService, ComponentOrderResource) {

    var cachedComponentOrders = [];

    function defaultSingletonComponentOrder() {
      return [
        {component: 'STUDIES'},
        {component: 'DEGREES'},
        {component: 'WORK_EXPERIENCE'},
        {component: 'SAMPLES'},
        {component: 'ATTAINMENTS'},
        {component: 'LANGUAGE_PROFICIENCIES'},
        {component: 'FAVORITES'}
      ];
    }

    function singletonComponentOrders(portfolio) {
      return cachedComponentOrders.length ? cachedComponentOrders.filter(function(el) {
        return el.component !== 'FREE_TEXT_CONTENT';
      }) : defaultSingletonComponentOrder();
    }

    function getFreeTextContentItemOrder(item, allFreeTextContentItems) {
      var componentOrder = _.find(cachedComponentOrders, ['instanceName', item.instanceName]) || {};

      return componentOrder.orderValue;
    }

    function subscribeToComponentOrderChanges(portfolio, callback) {
      if (portfolio.componentOrders.length) {
        cachedComponentOrders = portfolio.componentOrders;
      }

      FreeTextContentService.getFreeTextContentSubject()
        .subscribe(function(freeTextContentItems) {
          var freeTextContentComponentOrders, allComponentOrders;

          freeTextContentComponentOrders = freeTextContentItems ? freeTextContentItems.map(function(el) {
            return {
              component: 'FREE_TEXT_CONTENT',
              instanceName: el.instanceName,
              orderValue: getFreeTextContentItemOrder(el, freeTextContentItems)
            };
          }) : [];

          allComponentOrders = singletonComponentOrders(portfolio).concat(freeTextContentComponentOrders);
          callback(_.sortBy(allComponentOrders, 'orderValue'));
        });
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
      }).then(function(componentOrders) {
        cachedComponentOrders = componentOrders;
      });
    }

    return {
      subscribeToComponentOrderChanges: subscribeToComponentOrderChanges,
      updateComponentOrder: updateComponentOrder
    };
  });
