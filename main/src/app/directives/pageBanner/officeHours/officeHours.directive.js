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

angular.module('directives.officeHours', ['resources.officeHours', 'resources.degreeProgrammes'])
  .directive('officeHours', function(OfficeHoursResource, DegreeProgrammesResource) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/pageBanner/officeHours/officeHours.html',
      link: function(scope) {

        function loadDegreeProgrammes() {
          DegreeProgrammesResource.getDegreeProgrammes().then(function(degreeProgrammes) {
            scope.degreeProgrammes = _.cloneDeep(degreeProgrammes);
            scope.availableDegreeProgrammes = _.cloneDeep(degreeProgrammes);
          });
        };

        function loadOfficeHours() {
          OfficeHoursResource.getOfficeHours().then(officeHoursLoaded);
        };

        function officeHoursLoaded(officeHours) {
          scope.loaded = true;
          if (officeHours.description) {
            scope.edit = false;
          }

          scope.officeHours = {description: officeHours.description, degreeProgrammes: []};

          _.forEach(officeHours.degreeProgrammes, function(programme) {
            scope.officeHours.degreeProgrammes.push(_.find(scope.degreeProgrammes, ['code', programme.code]));
          });
        }

        scope.addDegreeProgramme = function addDegreeProgramme(degreeProgramme) {
          if (degreeProgramme !== null) {
            scope.newOfficeHours.degreeProgrammes.push(_.find(scope.degreeProgrammes, ['code', degreeProgramme]));
            _.remove(scope.availableDegreeProgrammes, ['code', degreeProgramme]);
          }
        };

        scope.removeDegreeProgramme = function removeDegreeProgramme(degreeProgramme) {
          _.remove(scope.newOfficeHours.degreeProgrammes, ['code', degreeProgramme.code]);
          scope.availableDegreeProgrammes.push(degreeProgramme);
        };

        scope.publishOfficeHours = function publishOfficeHours() {
          if (scope.newOfficeHours.description && scope.newOfficeHours.degreeProgrammes.length > 0) {
            OfficeHoursResource.saveOfficeHours(scope.newOfficeHours).then(officeHoursLoaded);
          }
        };

        scope.deleteOfficeHours = function deleteOfficeHours() {
          scope.availableDegreeProgrammes = _.cloneDeep(scope.degreeProgrammes);
          OfficeHoursResource.deleteOfficeHours(scope.officeHours)
            .then(function officeHoursDeleted(officeHours) {
              scope.officeHours = officeHours;
              scope.newOfficeHours = {description: null, degreeProgrammes: []};
              scope.edit = true;
            });
        };

        scope.editOfficeHours = function editOfficeHours() {
          scope.edit = true;
          scope.newOfficeHours.description = scope.officeHours.description;
          scope.newOfficeHours.degreeProgrammes = _.cloneDeep(scope.officeHours.degreeProgrammes);
          _.forEach(scope.newOfficeHours.degreeProgrammes, function(programme) {
            _.remove(scope.availableDegreeProgrammes, ['code', programme.code]);
          });
        };

        scope.cancel = function cancel() {
          scope.edit = false;
        };

        scope.newOfficeHours = {description: null, degreeProgrammes: []};
        scope.loaded = false;
        scope.edit = true;

        loadDegreeProgrammes();
        loadOfficeHours();
      }
    };
  });
