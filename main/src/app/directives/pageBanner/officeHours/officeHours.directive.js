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

angular.module('directives.officeHours', [
  'services.officeHours',
  'services.session',
  'ui.bootstrap.modal'
])
  .directive('officeHours', function(OfficeHoursService, SessionService, $uibModal) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/pageBanner/officeHours/officeHours.html',
      link: function(scope) {

        function initOfficeHours() {
          OfficeHoursService.loadDegreeProgrammes().then(function(degreeProgrammes) {
            scope.degreeProgrammes = _.cloneDeep(degreeProgrammes);
            scope.availableDegreeProgrammes = _.cloneDeep(degreeProgrammes);
            OfficeHoursService.loadOfficeHours().then(officeHoursLoaded);
          });
        };

        function officeHoursLoaded(officeHours) {
          scope.loaded = true;
          scope.officeHoursList = officeHours.map(function(oh) {
            return {
              description: oh.description,
              additionalInfo: oh.additionalInfo,
              location: oh.location,
              degreeProgrammes: oh.degreeProgrammes.map(function(programme) {
                return _.find(scope.degreeProgrammes, ['code', programme.code]);
              }),
              name: scope.userName
            };
          });
        }

        scope.addDegreeProgramme = function addDegreeProgramme(degreeProgramme) {
          if (degreeProgramme !== null) {
            scope.officeHoursUnderEdit.degreeProgrammes.push(_.find(scope.degreeProgrammes, ['code', degreeProgramme]));
            _.remove(scope.availableDegreeProgrammes, ['code', degreeProgramme]);
          }
        };

        scope.removeDegreeProgramme = function removeDegreeProgramme(degreeProgramme) {
          _.remove(scope.officeHoursUnderEdit.degreeProgrammes, ['code', degreeProgramme.code]);
          scope.availableDegreeProgrammes.push(degreeProgramme);
        };

        scope.publishOfficeHours = function publishOfficeHours() {
          OfficeHoursService.saveOfficeHours(scope.officeHoursUnderEdit).then(officeHoursLoaded);
        };

        scope.editOfficeHours = function editOfficeHours(index) {
          scope.officeHoursUnderEdit = _.cloneDeep(scope.officeHoursList[index]);
          scope.availableDegreeProgrammes = scope.degreeProgrammes.filter(function(code) {
            return !_.find(scope.officeHoursUnderEdit.degreeProgrammes, ['code', code.code]);
          });
          scope.editedOfficeHoursIndex = index;
          scope.openEditDialog();
        };

        scope.deleteConfirmationIndex = -1;
        scope.showDeleteConfirmation = function showDeleteConfirmation(index) {
          scope.deleteConfirmationIndex = index;
        };
        scope.clearDeleteConfirmation = function clearDeleteConfirmation() {
          scope.deleteConfirmationIndex = -1;
        };

        scope.shouldDeleteConfirmationBeShown = function shouldDeleteConfirmationBeShown(index) {
          return index === scope.deleteConfirmationIndex;
        };

        scope.deleteOfficeHours = function deleteOfficeHours(index) {
          scope.officeHoursList.splice(index,1);
          scope.deleteConfirmationIndex = -1;
          OfficeHoursService.saveOfficeHours(scope.officeHoursList).then(officeHoursLoaded);
        };

        scope.addOfficeHours = function addOfficeHours() {
          scope.editedOfficeHoursIndex = -1;
          scope.resetOfficeHoursUnderEdit();
          scope.openEditDialog();
        };

        scope.openEditDialog = function openEditDialog() {
          scope.modalInstance = $uibModal.open({
            templateUrl: 'officeHoursEditDialog.html',
            scope: scope,
            animation: false,
            windowClass: 'dialog'
          });
        };

        scope.editDialogOk = function editDialogOk() {
          if (scope.canPublishEdits()) {
            if (scope.editedOfficeHoursIndex === -1) {
              scope.officeHoursList.push(_.cloneDeep(scope.officeHoursUnderEdit));
            } else {
              scope.officeHoursList[scope.editedOfficeHoursIndex] = _.cloneDeep(scope.officeHoursUnderEdit);
            }
            scope.resetOfficeHoursUnderEdit();
            OfficeHoursService.saveOfficeHours(scope.officeHoursList).then(officeHoursLoaded);
          }

          scope.modalInstance.close();
        };

        scope.editDialogCancel = function editDialogCancel() {
          scope.modalInstance.close();
          scope.resetOfficeHoursUnderEdit();
        };

        scope.canPublishEdits = function canPublishEdits() {
          return scope.officeHoursUnderEdit.description &&
            scope.officeHoursUnderEdit.degreeProgrammes.length > 0 &&
            scope.officeHoursUnderEdit.name;
        };

        scope.resetOfficeHoursUnderEdit = function resetOfficeHoursUnderEdit() {
          scope.officeHoursUnderEdit = {
            description: null,
            degreeProgrammes: [],
            name: scope.userName
          };
        };
        scope.resetOfficeHoursUnderEdit();

        scope.loaded = false;

        SessionService.getSession().then(function getSessionSuccess(session) {
          scope.userName = session.name;
          scope.resetOfficeHoursUnderEdit();
        });

        initOfficeHours();
      }
    };
  });
