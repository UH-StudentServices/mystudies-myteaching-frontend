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

angular.module('dialog.verificationDialog', [
  'ui.bootstrap.modal',
  'uib/template/modal/window.html'
])

  .factory('VerificationDialog', function ($uibModal, $rootScope) {
    function open(translationKey, okKey, cancelKey, okCallback, cancelCallback) {
      var scope = $rootScope.$new();
      var modalInstance;

      scope.okCallback = function (event) {
        modalInstance.close();
        if (okCallback) {
          okCallback(event);
        }
      };

      scope.cancelCallback = function (event) {
        modalInstance.close();
        if (cancelCallback) {
          cancelCallback(event);
        }
      };

      scope.translationKey = translationKey;
      scope.okKey = okKey;
      scope.cancelKey = cancelKey;

      modalInstance = $uibModal.open({
        templateUrl: 'app/dialog/verificationDialog.html',
        scope: scope,
        windowClass: 'confirm',
        animation: false,
        backdrop: true
      });
    }

    return { open: open };
  });
