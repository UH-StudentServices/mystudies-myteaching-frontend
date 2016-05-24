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

angular.module('utils.browser', [])

  .service('BrowserUtil', function($window) {

    var MOBILE_MAX_WIDTH = 767,
        browser = $window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)')
        .matches ? {deviceCategory: 'MOBILE'} : {deviceCategory: 'DESKTOP'};

    function supportsCamera() {
      navigator.getMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      return navigator.getMedia ? true : false;
    }

    function setDeviceCategory() {
      browser.deviceCategory = isMobile() ? 'MOBILE' : 'DESKTOP';
    }

    function isMobile() {
      return $window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches;
    }

    function isMac() {
      return navigator.platform.match(/(Mac|iPhone|iPad)/i) ? true : false;
    }

    window.addEventListener('resize', setDeviceCategory);

    return {
      browser: browser,
      supportsCamera: supportsCamera,
      isMobile: isMobile,
      isMac: isMac
    };
  });
