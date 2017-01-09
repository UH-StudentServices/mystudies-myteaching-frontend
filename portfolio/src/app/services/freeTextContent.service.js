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

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(_.property('id'));
    }

    function getFreeTextContent(searchCriteria) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        if (portfolio.freeTextContent == null) {
          portfolio.freeTextContent = [];
        }
        return portfolio.freeTextContent.filter(_.matches(searchCriteria));
      });
    }

    function updateCachedPortfolio(freeTextContent, visibilityDescriptor, remove) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        var idx = _.findIndex(portfolio.freeTextContent, _.pick(freeTextContent, 'id'));

        if (idx !== -1 && !remove) {
          portfolio.freeTextContent.splice(idx, 1, freeTextContent);
        } else if (idx !== -1 && remove) {
          portfolio.freeTextContent.splice(idx, 1);
        } else {
          if (portfolio.freeTextContent == null) {
            portfolio.freeTextContent = [];
          }
          portfolio.freeTextContent.push(freeTextContent);
        }

        return getFreeTextContent(visibilityDescriptor);
      });
    }

    function insertFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.insertFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent, visibilityDescriptor);
      });
    }

    function updateFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.updateFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent, visibilityDescriptor);
      });
    }

    function deleteFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.deleteFreeTextContent(portfolioId, freeTextContent);
      }).then(function() {
        return updateCachedPortfolio(freeTextContent, visibilityDescriptor, true);
      });
    }

    return {
      getFreeTextContent: getFreeTextContent,
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
