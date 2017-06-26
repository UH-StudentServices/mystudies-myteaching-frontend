angular.module('resources.freeTextContent', ['services.state'])

  .factory('FreeTextContentResource', function(StateService, $resource) {

    function freeTextResource(portfolioId) {
      return $resource('/api/:state/v1/portfolio/:portfolioId/freetextcontent/:freeTextContentId',
        {state: StateService.getCurrent(), portfolioId: portfolioId, freeTextContentId: '@id'},
        {'update': {method: 'PUT'}});
    }

    function insertFreeTextContent(portfolioId, freeTextContent) {
      return freeTextResource(portfolioId).save(freeTextContent).$promise;
    }

    function updateFreeTextContent(portfolioId, freeTextContent) {
      return freeTextResource(portfolioId).update(freeTextContent).$promise;
    }

    function deleteFreeTextContent(portfolioId, freeTextContent, instanceName) {
      return freeTextResource(portfolioId)
        .delete({freeTextContentId: freeTextContent.id, instanceName: instanceName}).$promise;
    }

    return {
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
