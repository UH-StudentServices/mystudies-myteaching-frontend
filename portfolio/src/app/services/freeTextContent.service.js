angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.portfolio'])

  .factory('FreeTextContentService', function(PortfolioService, FreeTextContentResource) {

    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(_.property('id'));
    }

    function getFreeTextContent(section) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        if (section) {
          return portfolio.freeTextContent.filter(function(el) {
            return el.portfolioSection === section;
          });
        } else {
          return portfolio.freeTextContent;
        }
      });
    }

    function updateCachedPortfolio(freeTextContent, section, remove) {
      return PortfolioService.getPortfolio().then(function(portfolio) {
        var idx = _.findIndex(portfolio.freeTextContent, _.pick(freeTextContent, 'id'));

        if (idx !== -1 && !remove) {
          portfolio.freeTextContent.splice(idx, 1, freeTextContent);
        } else if (idx !== -1 && remove) {
          portfolio.freeTextContent.splice(idx, 1);
        } else {
          portfolio.freeTextContent.push(freeTextContent);
        }

        return getFreeTextContent(section);
      });
    }

    function insertFreeTextContent(freeTextContent, section) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.insertFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent, section);
      });
    }

    function updateFreeTextContent(freeTextContent, section) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.updateFreeTextContent(portfolioId, freeTextContent);
      }).then(function(freeTextContent) {
        return updateCachedPortfolio(freeTextContent, section);
      });
    }

    function deleteFreeTextContent(freeTextContent, section) {
      return getPortfolioId().then(function(portfolioId) {
        return FreeTextContentResource.deleteFreeTextContent(portfolioId, freeTextContent);
      }).then(function() {
        return updateCachedPortfolio(freeTextContent, section, true);
      });
    }

    return {
      getFreeTextContent: getFreeTextContent,
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
