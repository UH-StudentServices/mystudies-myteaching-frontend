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

angular.module('services.language', ['constants.language'])
.constant('SUPPORTED_LANGUAGES', [
  'en', 'fi', 'sv'
])
.constant('DEFAULT_LANGUAGE', 'en')

.config(function($translateProvider,
                 $cookiesProvider,
                 SUPPORTED_LANGUAGES,
                 DEFAULT_LANGUAGE,
                 TRANSLATION_FILE_PREFIX) {
  $translateProvider.useStaticFilesLoader({
    prefix: TRANSLATION_FILE_PREFIX,
    suffix: '.json'
  });
  $translateProvider.useCookieStorage();
  $translateProvider.storageKey('OO_LANGUAGE');
  $translateProvider.useSanitizeValueStrategy('escaped');
  $translateProvider.registerAvailableLanguageKeys(SUPPORTED_LANGUAGES, {
    'fi_*': 'fi',
    'sv_*': 'sv',
    '*': DEFAULT_LANGUAGE
  }).determinePreferredLanguage();

  $cookiesProvider.defaults.path = '/';
  $cookiesProvider.defaults.domain = '.helsinki.fi';
  $cookiesProvider.defaults.expires = moment().add(10, 'year').calendar();
})

.factory('LanguageService', function($translate) {
  return {
    getCurrent: function() {
      return $translate.proposedLanguage() || $translate.use();
    }
  };
});




