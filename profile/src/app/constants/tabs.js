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

angular.module('constants.profileTabs', [])
  .constant('profileTabs', [
    {
      key: 'tabs.basicInformation',
      name: 'BASIC_INFORMATION',
      templateUrl: 'app/partials/tabs/_basic_information.html',
      activeByDefault: true
    },
    {
      key: 'tabs.research',
      name: 'RESEARCH',
      templateUrl: 'app/partials/tabs/_research.html'
    },
    {
      key: 'tabs.teaching',
      name: 'TEACHING',
      templateUrl: 'app/partials/tabs/_teaching.html'
    },
    {
      key: 'tabs.administration',
      name: 'ADMINISTRATION',
      templateUrl: 'app/partials/tabs/_administration.html'
    }
  ]);
