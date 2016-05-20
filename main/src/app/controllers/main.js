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
  'directives.userMenu',
  'directives.attainments',
  'directives.favorites',
  'directives.userBackground',
  'directives.globalMessages',
  'directives.todoItems',
  'directives.pageHeader',
  'directives.mobileToolbar',
  'directives.weekFeed',
  'directives.usefulLinks',
  'directives.searchResults',
  'directives.admin.feedback',
  'services.focus'
])

  .controller('MainCtrl', function(
    $scope,
    StateService,
    State,
    userSettings,
    session,
    getCourses,
    getEvents,
    UserSettingsService) {

    $scope.currentStateName = StateService.getRootStateName();
    $scope.State = State;
    $scope.userSettings = userSettings;
    $scope.showApp = session !== undefined;
    $scope.session = session;
    $scope.courses = getCourses();
    $scope.events = getEvents();

    UserSettingsService.getShowBannerSubject().subscribe(function(showBanner) {
      $scope.showBanner = showBanner;
    });

  });