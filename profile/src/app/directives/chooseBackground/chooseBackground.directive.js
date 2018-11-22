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

angular.module('directives.chooseBackground', [
  'ui.bootstrap.modal',
  'directives.uploadImage',
  'services.userSettings',
  'services.profileBackground',
  'profileAnalytics'
])

  .directive('chooseBackgroundButton', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/chooseBackground/chooseBackgroundButton.html',
      scope: {},
      controller: function ($scope, $uibModal, $rootScope, UserSettingsService,
        ProfileBackgroundService, backgroundChangeEvent, AnalyticsService) {
        $scope.openChooseBGModal = function () {
          $uibModal.open({
            templateUrl: 'app/directives/chooseBackground/chooseDefaultBackground.html',
            controller: 'ChooseDefaultBackgroundController',
            size: 'lg',
            animation: false,
            backdrop: 'static'
          });
        };

        $scope.upload = function (image) {
          return ProfileBackgroundService.uploadUserBackground(image).then(function () {
            $rootScope.$broadcast(backgroundChangeEvent);
            AnalyticsService.trackEvent(
              AnalyticsService.ec.BACKGROUND_IMAGE,
              AnalyticsService.ea.UPLOAD
            );
          });
        };
      }
    };
  })

  .controller('ChooseDefaultBackgroundController', function ($scope,
    $uibModalInstance,
    UserSettingsService,
    ProfileBackgroundService,
    $q,
    $rootScope,
    backgroundChangeEvent,
    AnalyticsService) {
    var availableBackgroundImages;
    var selectedItemIndex;

    $q.all([UserSettingsService.getUserSettings(), UserSettingsService.getAvailableBackgrounds()])
      .then(function (data) {
        var userBackgroundImage;
        availableBackgroundImages = data[1];
        userBackgroundImage = data[0].backgroundFilename
          ? data[0].backgroundFilename
          : _.first(availableBackgroundImages);

        selectedItemIndex = _.indexOf(availableBackgroundImages, userBackgroundImage);
        $scope.backgroundImages = availableBackgroundImages;
      });

    function getSelectedBackgroundImageName() {
      return availableBackgroundImages[selectedItemIndex];
    }

    $scope.ok = function () {
      ProfileBackgroundService.selectProfileBackground(getSelectedBackgroundImageName())
        .then(function () {
          AnalyticsService.trackEvent(AnalyticsService.ec.BACKGROUND_IMAGE,
            AnalyticsService.ea.SAVE, getSelectedBackgroundImageName());
          $rootScope.$broadcast(backgroundChangeEvent);
          $uibModalInstance.dismiss();
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };

    $scope.init = function (slider) {
      slider.element.flexAnimate(selectedItemIndex);
    };

    $scope.change = function (slider) {
      selectedItemIndex = slider.element.currentSlide;
    };
  });
