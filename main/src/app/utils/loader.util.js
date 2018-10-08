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

angular.module('utils.loader', ['blockUI'])
  .constant('BlockUITemplate',
    '<div class="block-ui-overlay"></div>'
    + '<div class="block-ui-message-container">'
      + '<div class="content-loader__loader">'
        + '<span class="icon--spinner icon-spin"/>'
      + '</div>'
    + '</div>')

  .config(function (blockUIConfig, BlockUITemplate) {
    blockUIConfig.autoBlock = false;
    blockUIConfig.template = BlockUITemplate;
  })

  .factory('Loader', function ($filter, blockUI) {
    function getLoaderInstance(key) {
      return blockUI.instances.get(key);
    }

    function start(key) {
      getLoaderInstance(key).start();
    }

    function stop(key) {
      getLoaderInstance(key).stop();
    }

    return {
      start: start,
      stop: stop
    };
  });
