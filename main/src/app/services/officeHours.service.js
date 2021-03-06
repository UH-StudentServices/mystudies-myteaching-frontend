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

angular.module('services.officeHours', [
  'resources.officeHours',
  'resources.degreeProgrammes'
])
  .factory('OfficeHoursService', function SessionService(OfficeHoursResource, DegreeProgrammesResource) {
    function loadDegreeProgrammes() {
      return DegreeProgrammesResource.getDegreeProgrammes();
    }

    function loadOfficeHours() {
      return OfficeHoursResource.getOfficeHours();
    }

    function saveOfficeHours(officeHours) {
      return OfficeHoursResource.saveOfficeHours({ officeHours: officeHours });
    }

    function deleteOfficeHours() {
      return OfficeHoursResource.deleteOfficeHours();
    }

    function loadTeachingLanguages() {
      return OfficeHoursResource.getTeachingLanguages();
    }

    return {
      loadDegreeProgrammes: loadDegreeProgrammes,
      loadOfficeHours: loadOfficeHours,
      saveOfficeHours: saveOfficeHours,
      deleteOfficeHours: deleteOfficeHours,
      loadTeachingLanguages: loadTeachingLanguages
    };
  });
