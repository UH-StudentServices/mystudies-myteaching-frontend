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

'use strict';

angular.module('resources.attainment', ['utils.moment'])
  .constant('ALL_ATTAINMENTS', 9999)

  .factory('AttainmentResource', function Attainments($resource,
    StateService,
    dateArrayToMomentObject,
    ALL_ATTAINMENTS) {
    var updateWhitelist;
    var getAll;
    var getAllWhitelisted;
    var getWhitelist;

    function portfolioAttainmentsPrivateResource() {
      return $resource('/api/private/v1/portfolio/:portfolioId/attainment/whitelist', {}, {
        updateWhitelist: { method: 'POST' },
        getWhitelist: { method: 'GET' }
      });
    }

    updateWhitelist = function updateWhitelistfn(portfolioId, whitelistDto) {
      return portfolioAttainmentsPrivateResource()
        .updateWhitelist({ portfolioId: portfolioId }, whitelistDto)
        .$promise;
    };

    getAll = function getAllFn(portfolioLang) {
      var attainmentsResource = $resource('/api/private/v1/studyattainments', {
        limit: ALL_ATTAINMENTS,
        lang: portfolioLang
      });

      return attainmentsResource.query().$promise.then(function getAllSuccess(data) {
        return _.map(data, function datesToMoment(attainment) {
          attainment.attainmentDate = dateArrayToMomentObject(attainment.attainmentDate);
          return attainment;
        });
      });
    };

    getAllWhitelisted = function getAllWhitelistedFn(portfolioId, portfolioLang) {
      var attainmentsResource = $resource('/api/' + StateService.getCurrent()
        + '/v1/portfolio/:portfolioId/attainment', { portfolioId: portfolioId, lang: portfolioLang });

      return attainmentsResource.query().$promise.then(function getAllSuccess(data) {
        return _.map(data, function datesToMoment(attainment) {
          attainment.attainmentDate = dateArrayToMomentObject(attainment.attainmentDate);
          return attainment;
        });
      });
    };

    getWhitelist = function getWhitelistFn(portfolioId) {
      return portfolioAttainmentsPrivateResource()
        .getWhitelist({ portfolioId: portfolioId })
        .$promise;
    };

    return {
      getAll: getAll,
      getAllWhitelisted: getAllWhitelisted,
      getWhitelist: getWhitelist,
      updateWhitelist: updateWhitelist
    };
  });
