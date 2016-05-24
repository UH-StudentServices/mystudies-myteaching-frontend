angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.portfolio'])

  .factory('FreeTextContentService', function(PortfolioService, FreeTextContentResource) {

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        return portfolio.id;
      });
    }

    function insertFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.insertFreeTextContent(portfolioId, freeTextContent);
      });
    }

    function updateFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.updateFreeTextContent(portfolioId, freeTextContent);
      });
    }

    function deleteFreeTextContent(freeTextContent) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.deleteFreeTextContent(portfolioId, freeTextContent);
      });
    }

    return {
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
