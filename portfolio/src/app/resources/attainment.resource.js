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

  .factory('AttainmentResource', function Attainments($resource, StateService,
                                                      dateArrayToMomentObject) {

    function portfolioAttainmentsPrivateResource() {
      return $resource('/api/private/v1/portfolio/:portfolioId/attainment/whitelist', {}, {
        'updateWhitelist': {method: 'POST'},
        'getWhitelist': {method: 'GET'}
      });
    }

    var updateWhitelist = function updateWhitelist(portfolioId, whitelistDto) {
      return portfolioAttainmentsPrivateResource().updateWhitelist({
        portfolioId: portfolioId
      }, whitelistDto).$promise;
    };

    var getAll = function getAll(limit) {
      var attainmentsResource = $resource('/api/private/v1/studyattainments?limit=:limit', {
        limit: limit
      });

      return attainmentsResource.query().$promise.then(function getAllSuccess(data) {
        return _.map(data, function datesToMoment(attainment) {
          attainment.attainmentDate =
            dateArrayToMomentObject(attainment.attainmentDate);
          return attainment;
        });
      });
    };

    var getAllWhitelisted = function getAllWhitelisted(portfolioId) {
      var attainmentsResource = $resource('/api/' + StateService.getCurrent() +
        '/v1/portfolio/:portfolioId/attainment', {portfolioId: portfolioId});

      return attainmentsResource.query().$promise.then(function getAllSuccess(data) {
        return _.map(data, function datesToMoment(attainment) {
          attainment.attainmentDate =
            dateArrayToMomentObject(attainment.attainmentDate);
          return attainment;
        });
      });
    };

    var getWhitelist = function getWhitelist(portfolioId) {
      return portfolioAttainmentsPrivateResource().getWhitelist({
        portfolioId: portfolioId
      }).$promise;
    };

    return {
      getAll: getAll,
      getAllWhitelisted: getAllWhitelisted,
      getWhitelist: getWhitelist,
      updateWhitelist: updateWhitelist
    };

  });