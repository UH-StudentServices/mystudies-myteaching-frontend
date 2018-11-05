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

angular.module('resources.portfolioBackground', [])

  .factory('PortfolioBackgroundResource', function ($resource, StateService) {
    function portfolioBackgroundResource(portfolioId) {
      var portfolioBackgroundUrl = '/api/' + StateService.getCurrent()
        + '/v1/profile/' + portfolioId + '/background';

      return $resource(portfolioBackgroundUrl, { id: '@id' }, {
        selectPortfolioBackground: {
          method: 'PUT',
          url: portfolioBackgroundUrl + '/select'
        },
        uploadPortfolioBackground: {
          method: 'PUT',
          url: portfolioBackgroundUrl + '/upload'
        },
        getPortfolioBackground: {
          method: 'GET',
          url: portfolioBackgroundUrl
        }
      });
    }

    function selectPortfolioBackground(portfolioId, filename) {
      return portfolioBackgroundResource(portfolioId)
        .selectPortfolioBackground({ filename: filename }).$promise;
    }

    function getPortfolioBackground(portfolioId) {
      return portfolioBackgroundResource(portfolioId).getPortfolioBackground().$promise;
    }

    function uploadUserBackground(portfolioId, imageBase64) {
      return portfolioBackgroundResource(portfolioId)
        .uploadPortfolioBackground({ imageBase64: imageBase64 }).$promise;
    }

    return {
      selectPortfolioBackground: selectPortfolioBackground,
      getPortfolioBackground: getPortfolioBackground,
      uploadUserBackground: uploadUserBackground
    };
  });
