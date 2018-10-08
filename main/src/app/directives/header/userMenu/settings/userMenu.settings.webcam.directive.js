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

angular.module('webcam', ['utils.browser'])
  .directive('webcam', function (BrowserUtil) {
    return {
      template: '<div class="webcam" ng-transclude></div>',
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        onError: '&',
        onStream: '&',
        onStreaming: '&',
        placeholder: '=',
        config: '=channel'
      },
      link: function postLink($scope, element) {
        var videoElem = null;
        var videoStream = null;
        var placeholder = null;

        var removeDOMElement = function removeDOMElement(DOMel) {
          if (DOMel) {
            angular.element(DOMel).remove();
          }
        };

        var onDestroy = function onDestroy() {
          if (!!videoStream && typeof videoStream.stop === 'function') {
            videoStream.stop();
          }
          if (videoElem) {
            delete videoElem.src;
          }
        };

        // called when camera stream is loaded
        var onSuccess = function onSuccess(stream) {
          var vendorURL;
          videoStream = stream;

          // Firefox supports a src object
          if (navigator.mozGetUserMedia) {
            videoElem.mozSrcObject = stream;
          } else {
            vendorURL = window.URL || window.webkitURL;
            videoElem.src = vendorURL.createObjectURL(stream);
          }

          /* Start playing the video to show the stream from the webcam */
          videoElem.play();
          $scope.config.video = videoElem;

          /* Call custom callback */
          if ($scope.onStream) {
            $scope.onStream({ stream: stream });
          }
        };

        // called when any error happens
        var onFailure = function onFailure(err) {
          removeDOMElement(placeholder);

          /* Call custom callback */
          if ($scope.onError) {
            $scope.onError({ err: err });
          }
        };

        var startWebcam = function startWebcam() {
          var isStreaming = false;
          videoElem = document.createElement('video');
          videoElem.setAttribute('class', 'webcam-live');
          videoElem.setAttribute('autoplay', '');
          element.append(videoElem);

          if ($scope.placeholder) {
            placeholder = document.createElement('img');
            placeholder.setAttribute('class', 'webcam-loader');
            placeholder.src = $scope.placeholder;
            element.append(placeholder);
          }

          // Check the availability of getUserMedia across supported browsers
          if (!BrowserUtil.supportsCamera()) {
            onFailure({ code: -1, msg: 'Browser does not support getUserMedia.' });
            return;
          }
          // eslint-disable-next-line vars-on-top
          var mediaConstraint = { video: true, audio: false };

          navigator.getMedia(mediaConstraint, onSuccess, onFailure);

          /* Start streaming the webcam data when the video element can play
           * It will do it only once
           */
          videoElem.addEventListener('canplay', function () {
            if (!isStreaming) {
              isStreaming = true;
              $scope.config.video = videoElem;

              removeDOMElement(placeholder);

              /* Call custom callback */
              if ($scope.onStreaming) {
                $scope.onStreaming();
              }
            }
          }, false);
        };

        var stopWebcam = function stopWebcam() {
          onDestroy();
          if (videoElem) {
            videoElem.remove();
          }
        };

        $scope.config = $scope.config || {};
        $scope.$on('$destroy', onDestroy);
        $scope.$on('START_WEBCAM', startWebcam);
        $scope.$on('STOP_WEBCAM', stopWebcam);
      }
    };
  });
