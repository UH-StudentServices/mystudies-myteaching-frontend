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

angular.module('directives.cookieNotification', ['constants.commonExternalLinks',
                                                 'services.language',
                                                 'resources.userSettings'])

  .directive('cookieNotification', function(privacyPolicyLink, LanguageService, UserSettingsService) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/cookieNotification/cookieNotification.html',
      scope: {},
      link: function(scope, el) {
        scope.privacyPolicyLink = privacyPolicyLink;
        scope.selectedLanguage = LanguageService.getCurrent();

        scope.dismiss = function() {
          UserSettingsService.acceptCookies().then(function() {
            el.remove();
          });
        };
      }
    };
  });
