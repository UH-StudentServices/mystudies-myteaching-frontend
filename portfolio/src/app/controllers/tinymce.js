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

  .controller('TinymceController', function($scope, $http, LanguageService, PortfolioFilesResourcePath) {

    /* eslint-disable max-len */
    var unitubeRegex = /(helsinki\.fi\/[a-zA-Z]{2}|hy\.fi)\/unitube\/video\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
    var youtubeRegex = /(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|))([\w\-]{11})[?=&+%\w-]*/;
    var vimeoRegex = /vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)*/;
    /* eslint-enable */

    $scope.tinymceOptions = {
      // language: LanguageService.getCurrent() + '_FI',
      height: '300',
      plugins: 'link image code',
      toolbar: 'link uploadImage uploadFile',
      menubar: false,
      target_list: false,
      link_title: false,
      setup: setupEditor
    };

    function setupEditor(editor) {
      editor.addButton('uploadImage', {
        icon: 'image',
        onclick: function() { createInput(editor, uploadImage); }
      });

      editor.addButton('uploadFile', {
        image: '/portfolio/assets/icons/paperclip.svg',
        onclick: function() { createInput(editor, uploadFile); }
      });

      editor.on('paste', function(event) {
        var paste = event.clipboardData.getData('text');
        var unitubeMatch = paste.match(unitubeRegex);
        var youtubeMatch = paste.match(youtubeRegex);
        var vimeoMatch = paste.match(vimeoRegex);

        event.preventDefault();

        if (unitubeMatch) {
          editor.insertContent(
            '<iframe class="free-text-content__iframe" ' +
            'src="http://webcast.helsinki.fi/unitube/embed.html?id=' + unitubeMatch[2] +
            '" width="500" height="300"></iframe>'
          );
        } else if (youtubeMatch) {
          editor.insertContent(
            '<iframe class="free-text-content__iframe" src="https://youtube.com/embed/' + youtubeMatch[1] +
            '" width="500" height="300">'
          );
        } else if (vimeoMatch) {
          console.log(vimeoMatch);
          editor.insertContent(
            '<iframe class="free-text-content__iframe" src="https://player.vimeo.com/video/' + vimeoMatch[3] +
            '" width="500" height="300">'
          );
        } else {
          editor.insertContent(paste);
        }
      });
    }

    function createInput(editor, onSelect) {
      var input = document.createElement('input');

      input.type = 'file';
      input.onchange = function() { onSelect(input, editor); };
      input.click();
    }

    function uploadImage(input, editor) {
      upload(input, editor, function(res) { return '<img src="' + res.data.url + '">'; });
    }

    function uploadFile(input, editor) {
      upload(input, editor, function(res) {
        return '<a href="' + res.data.url + '" target="_blank">' + res.data.fileName + '</a>';
      });
    }

    function upload(input, editor, content) {
      var formData = new FormData();

      formData.append('upload', input.files[0]);

      $http({
        url: PortfolioFilesResourcePath,
        headers: {'Content-Type': undefined},
        data: formData,
        method: 'POST'
      })
        .then(function(res) {
          editor.insertContent(content(res));
        });
    }
  });
