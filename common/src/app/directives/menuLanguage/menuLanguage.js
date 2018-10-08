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

angular.module('directives.menuLanguage', ['services.language'])

  .directive('menuLanguage', function ($translate, $window, LanguageService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/menuLanguage/menu_language.html',
      link: function ($scope) {
        var languageOptions = [
          {
            nativeName: 'English',
            languageCode: 'en'
          }, {
            nativeName: 'Svenska',
            languageCode: 'sv'
          }, {
            nativeName: 'Suomi',
            languageCode: 'fi'
          }
        ];

        $scope.changeLanguage = function (languageKey) {
          $translate.use(languageKey).then(function translationUseSuccess() {
            $window.location.reload();
          });
        };

        $scope.selectedLanguage = LanguageService.getCurrent();

        $scope.getLanguageOptions = function getLanguageOptions(userLanguage) {
          if (userLanguage === 'fi') {
            return [languageOptions[0], languageOptions[1]];
          } if (userLanguage === 'sv') {
            return [languageOptions[0], languageOptions[2]];
          }
          return [languageOptions[2], languageOptions[1]];
        };
      }
    };
  });
