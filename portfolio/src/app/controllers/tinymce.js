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

/* eslint-disable camelcase */

angular.module('controllers.tinymce', ['ui.tinymce', 'services.language'])

  .controller('TinymceController', function($scope, LanguageService) {
    $scope.tinymceOptions = {
      // language: LanguageService.getCurrent() + '_FI',
      plugins: 'link image code media',
      toolbar: 'link image media',
      menubar: false,
      target_list: false,
      link_title: false,

      media_url_resolver: function(data, resolve) {
        // eslint-disable-next-line max-len
        var unitubeRegex = /(helsinki\.fi\/[a-zA-Z]{2}|hy\.fi)\/unitube\/video\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
        var unitubeMatch = data.url.match(unitubeRegex);

        if (unitubeMatch) {
          var html = '<iframe src="http://webcast.helsinki.fi/unitube/embed.html?id=' + unitubeMatch[2] +
            '" width="400" height="400"></iframe>';

          resolve({html: html});
        } else {
          resolve({html: ''});
        }
      }
    };
  });
