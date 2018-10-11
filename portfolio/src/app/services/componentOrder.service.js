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

  .factory('ComponentOrderService', function (FreeTextContentService, ComponentOrderResource) {
    var cachedComponentOrders = [];
    var freeTextContentComponentType = 'FREE_TEXT_CONTENT';

    var singletonFreeTextContentComponents = [
      {
        component: 'SKILLS_AND_EXPERTISE',
        instanceName: 'SKILLS_AND_EXPERTISE'
      }
    ];

    var defaultSingletonComponentOrder = [
      { component: 'STUDIES' },
      { component: 'DEGREES' },
      { component: 'WORK_EXPERIENCE' },
      { component: 'SAMPLES' },
      { component: 'ATTAINMENTS' },
      { component: 'LANGUAGE_PROFICIENCIES' }
    ];

    function getMissingDefaultFreeTextComponents() {
      return _.differenceBy(singletonFreeTextContentComponents, cachedComponentOrders, 'instanceName');
    }

    function singletonComponentOrders() {
      return cachedComponentOrders.length
        ? cachedComponentOrders.filter(function (el) {
          return el.component !== freeTextContentComponentType;
        })
        : defaultSingletonComponentOrder;
    }

    function getFreeTextContentItemOrder(item) {
      var componentOrder = _.find(cachedComponentOrders, ['instanceName', item.instanceName]) || {};

      return componentOrder.orderValue;
    }

    function getOrderedComponent(componentType, instanceName, orderValue) {
      return {
        component: componentType,
        instanceName: instanceName,
        orderValue: orderValue
      };
    }

    function isSingletonFreeTextComponent(componentInstance) {
      return singletonFreeTextContentComponents.some(function (singletonComponent) {
        return componentInstance.instanceName === singletonComponent.component;
      });
    }

    function subscribeToComponentOrderChanges(portfolio, callback) {
      if (portfolio.componentOrders.length) {
        cachedComponentOrders = portfolio.componentOrders;
      }

      FreeTextContentService.getFreeTextContentSubject()
        .subscribe(function (freeTextContentItems) {
          var freeTextContentComponentOrders;
          var allComponentOrders;

          freeTextContentComponentOrders = freeTextContentItems
            ? freeTextContentItems.map(function (componentInstance) {
              var componentType = isSingletonFreeTextComponent(componentInstance)
                ? componentInstance.instanceName
                : freeTextContentComponentType;

              return getOrderedComponent(
                componentType,
                componentInstance.instanceName,
                getFreeTextContentItemOrder(componentInstance)
              );
            })
            : [];

          allComponentOrders = singletonComponentOrders()
            .concat(getMissingDefaultFreeTextComponents())
            .concat(freeTextContentComponentOrders);

          callback(_.sortBy(allComponentOrders, 'orderValue'));
        });
    }

    function updateComponentOrder(portfolioId, updatedComponents) {
      ComponentOrderResource.updateComponentOrder(portfolioId, {
        componentOrders: updatedComponents.map(function (el, i) {
          var componentType = isSingletonFreeTextComponent(el)
            ? freeTextContentComponentType
            : el.component;
          return getOrderedComponent(componentType, el.instanceName, i + 1);
        })
      }).then(function (componentOrders) {
        cachedComponentOrders = componentOrders;
      });
    }

    return {
      subscribeToComponentOrderChanges: subscribeToComponentOrderChanges,
      updateComponentOrder: updateComponentOrder
    };
  });
