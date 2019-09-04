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

angular.module('controllers.main', [
  'constants.profileTabs',
  'services.componentOrder',
  'utils.browser'
])

  .controller('MainCtrl', function ($state, $scope, profileTabs, profile, state, userSettings,
    ComponentOrderService, PreviewService, State, BrowserUtil) {
    $scope.profile = profile;
    $scope.userSettings = userSettings;
    $scope.profileTabs = profileTabs;
    $scope.isPreview = PreviewService.isPreview();
    $scope.sectionSortDisabled = state !== State.PRIVATE || BrowserUtil.supportsTouch();
    $scope.profileSections = [];
    $scope
      .hideObar = state === State.PUBLIC || PreviewService.isPreview() || $state.params.sharedlink;

    ComponentOrderService.subscribeToComponentOrderChanges(profile, function (componentOrders) {
      $scope.profileSections = componentOrders;
    });

    $scope.sortableOptions = {
      containment: '.profile-components__dropzone',
      orderChanged: function (e) {
        var updatedSections = e.dest.sortableScope.modelValue;

        ComponentOrderService.updateComponentOrder(profile.id, updatedSections);
      },
      accept: function (sourceItemHandleScope, destSortableScope) {
        var sourceScopeParentId = sourceItemHandleScope.itemScope.sortableScope.$parent.$id;
        var destScopeParentId = destSortableScope.$parent.$id;
        return sourceScopeParentId === destScopeParentId;
      }
    };

    document.title = profile.ownerName;
  });
