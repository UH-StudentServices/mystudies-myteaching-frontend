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

angular.module('resources.freeTextContent', ['services.state'])

  .factory('FreeTextContentResource', function (StateService, $resource) {
    function freeTextResource(portfolioId) {
      return $resource('/api/:state/v1/profile/:portfolioId/freetextcontent/:freeTextContentId',
        { state: StateService.getCurrent(), portfolioId: portfolioId, freeTextContentId: '@id' },
        { update: { method: 'PUT' } });
    }

    function insertFreeTextContent(portfolioId, freeTextContent) {
      return freeTextResource(portfolioId).save(freeTextContent).$promise;
    }

    function updateFreeTextContent(portfolioId, freeTextContent) {
      return freeTextResource(portfolioId).update(freeTextContent).$promise;
    }

    function deleteFreeTextContent(portfolioId, freeTextContent, instanceName) {
      return freeTextResource(portfolioId)
        .delete({ freeTextContentId: freeTextContent.id, instanceName: instanceName }).$promise;
    }

    return {
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
