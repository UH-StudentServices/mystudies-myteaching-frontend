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

angular.module('resources.contactInformation', [])

  .constant('CONTACT_INFORMATION_RESOURCE_URL', '/api/:currentState/v1/profile/:profileId/contactinformation')

  .factory('ContactInformationResource', function ($resource, StateService, CONTACT_INFORMATION_RESOURCE_URL) {
    function resource() {
      return $resource(
        CONTACT_INFORMATION_RESOURCE_URL, {}, {
          update: { method: 'POST' },
          getEmployeeContactInformation: {
            method: 'GET',
            url: CONTACT_INFORMATION_RESOURCE_URL + '/teacher',
            params: {
              currentState: '@currentState',
              profileId: '@profileId'
            }
          }
        }
      );
    }

    function updateContactInformation(profileId, updateContactInformationRequest) {
      return resource().update(
        { currentState: StateService.getCurrent(), profileId: profileId },
        updateContactInformationRequest
      ).$promise;
    }

    function getEmployeeContactInformation(profileId) {
      return resource().getEmployeeContactInformation({
        currentState: StateService.getCurrent(),
        profileId: profileId
      }).$promise;
    }

    return {
      updateContactInformation: updateContactInformation,
      getEmployeeContactInformation: getEmployeeContactInformation
    };
  });
