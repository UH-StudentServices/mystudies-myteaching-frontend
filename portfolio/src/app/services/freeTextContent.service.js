angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.portfolio'])

  .factory('FreeTextContentService', function(PortfolioService, FreeTextContentResource) {

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(_.property('id'));
    }

    function getFreeTextContent(searchCriteria) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
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
