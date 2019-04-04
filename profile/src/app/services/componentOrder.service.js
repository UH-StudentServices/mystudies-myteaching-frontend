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

'use strict';

angular.module('services.componentOrder', ['services.freeTextContent', 'resources.componentOrder'])

  .factory('ComponentOrderService', function (FreeTextContentService, ComponentOrderResource) {
    var cachedComponentOrders = [];
    var FREE_CONTENT_COMPONENT_TYPE = 'FREE_TEXT_CONTENT';

    var singletonFreeTextContentComponents = [
      {
        component: FREE_CONTENT_COMPONENT_TYPE,
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

    function getMissingDefaultFreeTextComponents(freeTextContentItems) {
      return _.differenceBy(singletonFreeTextContentComponents, freeTextContentItems, 'instanceName');
    }

    function singletonComponentOrders() {
      return cachedComponentOrders.length
        ? cachedComponentOrders.filter(function (el) {
          return el.component !== FREE_CONTENT_COMPONENT_TYPE;
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

    function subscribeToComponentOrderChanges(profile, callback) {
      if (profile.componentOrders.length) {
        cachedComponentOrders = profile.componentOrders;
      }

      FreeTextContentService.getFreeTextContentSubject()
        .subscribe(function (freeTextContentItems) {
          var freeTextContentComponentOrders;
          var allFreeTextContentItems =
            getMissingDefaultFreeTextComponents(freeTextContentItems)
              .concat(freeTextContentItems || []);
          var allComponentOrders;

          freeTextContentComponentOrders =
            allFreeTextContentItems.map(function (componentInstance) {
              return getOrderedComponent(
                FREE_CONTENT_COMPONENT_TYPE,
                componentInstance.instanceName,
                getFreeTextContentItemOrder(componentInstance)
              );
            });

          allComponentOrders = singletonComponentOrders()
            .concat(freeTextContentComponentOrders);

          callback(_.sortBy(allComponentOrders, 'orderValue'));
        });
    }

    function updateComponentOrder(profileId, updatedComponents) {
      ComponentOrderResource.updateComponentOrder(profileId, {
        componentOrders: updatedComponents.map(function (el, i) {
          return getOrderedComponent(el.component, el.instanceName, i + 1);
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
