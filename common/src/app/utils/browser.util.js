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

  .service('BrowserUtil', function ($window) {
    var MOBILE_MAX_WIDTH = 767;
    var RESIZE_DEBOUNCE_DELAY = 200;
    var Rx = window.Rx;
    var viewportSizeSubject;

    function isMobile() {
      return $window.matchMedia('(max-width: ' + MOBILE_MAX_WIDTH + 'px)').matches;
    }

    function getViewportSize() {
      return isMobile() ? 'MOBILE' : 'DESKTOP';
    }

    function supportsCamera() {
      navigator.getMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.msGetUserMedia;

      return !!navigator.getMedia;
    }

    function supportsTouch() {
      return 'ontouchstart' in window;
    }

    function isMac() {
      return !!navigator.platform.match(/(Mac|iPhone|iPad)/i);
    }

    function isModernBrowser() {
      return 'fetch' in window && 'assign' in Object;
    }

    viewportSizeSubject = new Rx.BehaviorSubject(getViewportSize());

    window.addEventListener('resize', _.debounce(function () {
      viewportSizeSubject.onNext(getViewportSize());
    }, RESIZE_DEBOUNCE_DELAY));

    return {
      viewportSizeSubject: viewportSizeSubject,
      supportsCamera: supportsCamera,
      supportsTouch: supportsTouch,
      isMobile: isMobile,
      isMac: isMac,
      isModernBrowser: isModernBrowser
    };
  });
