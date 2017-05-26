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

angular.module('directives.officeHours', ['resources.officeHours'])
  .directive('officeHours', function(OfficeHoursResource) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/pageBanner/officeHours/officeHours.html',
      link: function(scope) {

        function loadOfficeHours() {
          OfficeHoursResource.getOfficeHours().then(function officeHoursLoaded(officeHours) {
            scope.loaded = true;
            scope.officeHours = officeHours;
            if (officeHours.description) {
              scope.edit = false;
            }
          });
        };

        scope.publishOfficeHours = function publishOfficeHours() {
          if (scope.newOfficeHours.description) {
            OfficeHoursResource.saveOfficeHours(scope.newOfficeHours)
              .then(function officeHoursSaved(officeHours) {
                scope.edit = false;
                scope.officeHours = officeHours;
              });
          }
        };

        scope.deleteOfficeHours = function deleteOfficeHours() {
          OfficeHoursResource.deleteOfficeHours(scope.officeHours)
            .then(function officeHoursDeleted(officeHours) {
              scope.officeHours = officeHours;
              scope.newOfficeHours = {description: null};
              scope.edit = true;
            });
        };

        scope.editOfficeHours = function editOfficeHours() {
          scope.edit = true;
          scope.newOfficeHours.description = scope.officeHours.description;
        };

        scope.cancel = function cancel() {
          scope.edit = false;
        };

        scope.newOfficeHours = {description: null};
        scope.loaded = false;
        scope.edit = true;

        loadOfficeHours();
      }
    };
  });
