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

angular.module('resources.officeHours', [])

  .factory('OfficeHoursResource', function OfficeHoursResource($resource) {
    var officeHoursResource = $resource('/api/private/v1/officehours', null, {
      save: { method: 'POST', isArray: true },
      get: { method: 'GET', isArray: true }
    });

    var teachingLanguagesResource = $resource('/api/private/v1/officehours/teaching-languages', null, { get: { method: 'GET', isArray: true } });

    function getOfficeHours() {
      return officeHoursResource.get().$promise;
    }

    function deleteOfficeHours() {
      return officeHoursResource.delete().$promise;
    }

    function saveOfficeHours(officehours) {
      return officeHoursResource.save(officehours).$promise;
    }

    function getTeachingLanguages() {
      return teachingLanguagesResource.get().$promise;
    }

    return {
      getOfficeHours: getOfficeHours,
      deleteOfficeHours: deleteOfficeHours,
      saveOfficeHours: saveOfficeHours,
      getTeachingLanguages: getTeachingLanguages
    };
  });
