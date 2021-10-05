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
  'services.language',
  'ui.bootstrap.modal',
  'utils.moment'
])
  .directive('officeHours', function ($q, OfficeHoursService, SessionService, LanguageService, $uibModal, dateArrayToMomentObject, momentDateToLocalDateArray) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/officeHours/officeHours.html',
      link: function (scope) {
        scope.currentLanguage = LanguageService.getCurrent();

        function setLoadError() {
          scope.loadError = true;
        }

        function formatOfficeHours(officeHoursList) {
          return officeHoursList.map(function (oh) {
            return {
              name: oh.name,
              additionalInfo: oh.additionalInfo,
              location: oh.location,
              expirationDate: momentDateToLocalDateArray(oh.expirationDate),
              description: oh.description,
              degreeProgrammes: oh.degreeProgrammes,
              languages: oh.languages
            };
          });
        }

        function hasExpired(expirationMoment) {
          return moment().diff(expirationMoment, 'days') > 0;
        }

        function officeHoursLoaded(officeHours) {
          scope.loaded = true;
          scope.officeHoursList = officeHours.map(function (oh) {
            return {
              description: oh.description,
              additionalInfo: oh.additionalInfo,
              location: oh.location,
              expirationDate: dateArrayToMomentObject(oh.expirationDate),
              expired: hasExpired(dateArrayToMomentObject(oh.expirationDate)),
              degreeProgrammes: oh.degreeProgrammes.map(function (programme) {
                return _.find(scope.degreeProgrammes, ['code', programme.code]);
              }),
              languages: oh.languages.map(function (language) {
                return _.find(scope.languages, ['code', language.code]);
              }),
              name: scope.userName
            };
          });
        }

        function initOfficeHours() {
          $q.all([
            OfficeHoursService.loadDegreeProgrammes(),
            OfficeHoursService.loadTeachingLanguages()
          ]).then(function (results) {
            scope.degreeProgrammes = results[0];
            scope.availableDegreeProgrammes = _.cloneDeep(results[0]);
            scope.languages = results[1];
            scope.availableLanguages = _.cloneDeep(scope.languages);
            scope.nameInCurrentLang = function (item) {
              return item.name[scope.currentLanguage];
            };

            return OfficeHoursService.loadOfficeHours();
          })
            .then(officeHoursLoaded)
            .catch(setLoadError);
        }

        scope.addDegreeProgramme = function addDegreeProgramme(degreeProgramme) {
          if (degreeProgramme) {
            scope.officeHoursUnderEdit.degreeProgrammes.push(_.find(scope.degreeProgrammes, ['code', degreeProgramme]));
            _.remove(scope.availableDegreeProgrammes, ['code', degreeProgramme]);
          }
        };

        scope.addTeachingLanguage = function addTeachingLanguage(teachingLanguage) {
          if (teachingLanguage) {
            scope.officeHoursUnderEdit.languages.push(_.find(scope.languages, ['code', teachingLanguage]));
            _.remove(scope.availableLanguages, ['code', teachingLanguage]);
          }
        };

        scope.removeDegreeProgramme = function removeDegreeProgramme(degreeProgramme) {
          _.remove(scope.officeHoursUnderEdit.degreeProgrammes, ['code', degreeProgramme.code]);
          scope.availableDegreeProgrammes.push(degreeProgramme);
        };

        scope.removeTeachingLanguage = function removeTeachingLanguage(teachingLanguage) {
          _.remove(scope.officeHoursUnderEdit.languages, ['code', teachingLanguage.code]);
          scope.availableLanguages.push(teachingLanguage);
        };

        scope.editOfficeHours = function editOfficeHours(index) {
          scope.officeHoursUnderEdit = _.cloneDeep(scope.officeHoursList[index]);
          scope.availableDegreeProgrammes = scope.degreeProgrammes.filter(function (programme) {
            return !_.find(scope.officeHoursUnderEdit.degreeProgrammes, ['code', programme.code]);
          });
          scope.availableLanguages = scope.languages.filter(function (lang) {
            return !_.find(scope.officeHoursUnderEdit.languages, ['code', lang.code]);
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
          scope.officeHoursList.splice(index, 1);
          scope.deleteConfirmationIndex = -1;
          OfficeHoursService.saveOfficeHours(formatOfficeHours(scope.officeHoursList))
            .then(officeHoursLoaded);
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
              scope.officeHoursList[scope.editedOfficeHoursIndex] =
                _.cloneDeep(scope.officeHoursUnderEdit);
            }
            scope.resetOfficeHoursUnderEdit();
            scope.loaded = false;
            OfficeHoursService.saveOfficeHours(formatOfficeHours(scope.officeHoursList))
              .then(officeHoursLoaded)
              .catch(setLoadError);
          }

          scope.modalInstance.close();
        };

        scope.editDialogCancel = function editDialogCancel() {
          scope.modalInstance.close();
          scope.resetOfficeHoursUnderEdit();
        };

        function degreeProgrammesTeachingLanguagesValid(officeHours) {
          return (officeHours.degreeProgrammes.length
            && !officeHours.languages.length)
            || (!officeHours.degreeProgrammes.length
              && officeHours.languages.length);
        }

        function isValidOfficeHours(officeHours) {
          return officeHours.description
            && officeHours.name
            && degreeProgrammesTeachingLanguagesValid(officeHours)
            && officeHours.expirationDate
            && officeHours.expirationDate.isValid()
            && officeHours.expirationDate.isBefore(moment().add(1, 'year'));
        }

        scope.isValidOfficeHours = isValidOfficeHours;

        scope.canPublishEdits = function canPublishEdits() {
          return isValidOfficeHours(scope.officeHoursUnderEdit);
        };

        scope.resetOfficeHoursUnderEdit = function resetOfficeHoursUnderEdit() {
          scope.officeHoursUnderEdit = {
            description: null,
            degreeProgrammes: [],
            languages: [],
            name: scope.userName,
            expirationDate: null
          };
        };
        scope.resetOfficeHoursUnderEdit();

        scope.loaded = false;
        scope.loadError = false;

        SessionService.getSession().then(function getSessionSuccess(session) {
          scope.userName = session.name;
          scope.resetOfficeHoursUnderEdit();
        });

        initOfficeHours();
      }
    };
  });
