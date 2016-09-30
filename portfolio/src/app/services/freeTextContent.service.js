angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.portfolio'])

  .factory('FreeTextContentService', function(PortfolioService, FreeTextContentResource) {

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        return portfolio.id;
      });
    }

    function updateCachedPortfolio(freeTextContent, remove) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        var idx = _.findIndex(portfolio.freeTextContent, _.pick(freeTextContent, 'id'));

        if (idx !== -1 && !remove) {
          portfolio.freeTextContent.splice(idx, 1, freeTextContent);
        } else if (idx !== -1 && remove) {
          portfolio.freeTextContent.splice(idx, 1);
        } else {
          portfolio.freeTextContent.push(freeTextContent);
        }

        return freeTextContent;
      });
    }

    function insertFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.insertFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent);
      });
    }

    function updateFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.updateFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent);
      });
    }

    function deleteFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.deleteFreeTextContent(portfolioId, freeTextContent);
      }).then(function() {
        return updateCachedPortfolio(freeTextContent, true);
      });
    }

    return {
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
