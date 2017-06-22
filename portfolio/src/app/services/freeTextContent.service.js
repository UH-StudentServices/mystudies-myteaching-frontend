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

angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.portfolio'])

  .factory('FreeTextContentService', function(PortfolioService, FreeTextContentResource) {
    var Rx = window.Rx,
        freeTextContentSubject,
        initialDataPromise,
        cachedFreeTextContent = [];

    function initCache() {
      initialDataPromise = PortfolioService.getPortfolio()
          .then(_.partialRight(_.get, 'freeTextContent', []))
          .then(function(freeTextContentItems) {
            cachedFreeTextContent = freeTextContentItems;

            return freeTextContentItems;
          }).then(publish);
    }

    function getFreeTextContentSubject() {
      if (!freeTextContentSubject) {
        freeTextContentSubject = new Rx.BehaviorSubject(cachedFreeTextContent);
      }

      return freeTextContentSubject;
    }

    function publish(freeTextContentItems) {
      freeTextContentSubject.onNext(freeTextContentItems);

      return freeTextContentItems;
    }

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(_.property('id'));
    }

    function updateCache(freeTextContent, visibilityDescriptor, remove) {
      if (_.find(cachedFreeTextContent, ['id', freeTextContent.id])) {
        cachedFreeTextContent = remove ?
          _.differenceBy(cachedFreeTextContent, [freeTextContent], 'id') :
          _.unionBy([freeTextContent], cachedFreeTextContent, 'id');
      } else {
        cachedFreeTextContent = cachedFreeTextContent.concat(freeTextContent);
      }

      return cachedFreeTextContent;
    }

    function getInitialData() {
      return initialDataPromise;
    }

    function insertFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.insertFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCache(freeTextContent, visibilityDescriptor);
      }).then(publish);
    }

    function updateFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.updateFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCache(freeTextContent, visibilityDescriptor);
      });
    }

    function deleteFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.deleteFreeTextContent(portfolioId, freeTextContent,
          visibilityDescriptor.instanceName);
      }).then(function() {
        return updateCache(freeTextContent, visibilityDescriptor, true);
      }).then(publish);
    }

    initCache();

    return {
      getInitialData: getInitialData,
      getFreeTextContentSubject: getFreeTextContentSubject,
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
