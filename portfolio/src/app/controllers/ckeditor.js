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

angular.module('controllers.ckeditor', ['ckeditor', 'services.language'])
  .controller('CkeditorCtrl', function($scope, LanguageService) {

    $scope.options = {
      language: LanguageService.getCurrent(),

      filebrowserBrowseUrl: '/portfolio/files',
      filebrowserImageBrowseUrl: '/api/private/v1/portfolio/files',
      filebrowserUploadUrl: '/api/private/v1/portfolio/files',
      filebrowserImageUploadUrl: '/api/private/v1/portfolio/files',

      toolbar: [['Link', 'Unlink']],
      linkShowTargetTab: false,
      removePlugins: 'elementspath',
      enterMode: CKEDITOR.ENTER_BR, // eslint-disable-line no-undef
      entities_latin: false // eslint-disable-line camelcase
    };
  });
