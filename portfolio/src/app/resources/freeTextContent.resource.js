angular.module('resources.freeTextContent', ['services.state'])


  .factory('FreeTextContentResource', function(StateService, $resource) {

    function workExperienceResource(portfolioId) {
      return $resource('/api/:state/v1/portfolio/:portfolioId/freetextcontent/:freeTextContentId',
        {state: StateService.getCurrent(), portfolioId: portfolioId, freeTextContentId: '@id'},
        {'update': {method: 'PUT'}});
    }

    function insertFreeTextContent(portfolioId, freeTextContent) {
      return workExperienceResource(portfolioId).save(freeTextContent).$promise;
    }

    function updateFreeTextContent(portfolioId, freeTextContent) {
      return workExperienceResource(portfolioId).update(freeTextContent).$promise;
    }

    function deleteFreeTextContent(portfolioId, freeTextContent) {
      return workExperienceResource(portfolioId)
        .delete({freeTextContentId: freeTextContent.id}).$promise;
    }

    return {
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
