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

angular.module('directives.uploadImage', ['directives.imgLoad', 'utils.browser'])

  .constant('MaxImageDimensionsDesktop', 2000)
  .constant('MaxImageDimensionsMobile', 1000)
  .constant('ImageSourceMedia', {
    WEBCAM : 'webcam',
    FILE_SYSTEM : 'fileSystem'
  })

  .factory('MaxImageDimensions', function(BrowserUtil, MaxImageDimensionsDesktop, MaxImageDimensionsMobile) {
    return {
      get : function() {
        return BrowserUtil.isMobile() ?  MaxImageDimensionsMobile : MaxImageDimensionsDesktop;
      }
    }
  })

  .constant('startImageCropperEvent', 'startImageCropperEvent')

  .service('ResizeImage', function(MaxImageDimensions) {

    function getDimensions(image) {
      var width = image.videoWidth ? image.videoWidth : image.width;
      var height = image.videoHeight ? image.videoHeight : image.height;

      var dimensions = {width : width, height : height};

      var currentMaxDimension = Math.max(width, height);
      var maxImageDimensions = MaxImageDimensions.get();

      if(currentMaxDimension > maxImageDimensions) {
        var factor = maxImageDimensions / currentMaxDimension;
        dimensions.resizedWidth = width * factor;
        dimensions.resizedHeight = height * factor;
      }
      return dimensions;
    }

    return function(image) {
      var dimensions = getDimensions(image);
      var canvas = document.createElement("canvas");

      var sWidth = dimensions.width;
      var sHeight = dimensions.height;
      var dWidth = dimensions.resizedWidth ? dimensions.resizedWidth : dimensions.width;
      var dHeight = dimensions.resizedHeight ? dimensions.resizedHeight : dimensions.height;

      canvas.width = dWidth;
      canvas.height = dHeight;
      canvas.getContext('2d').drawImage(image, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight);
      return canvas.toDataURL();
    }
  })

  .directive('uploadImage', function($modal,
                                     Camera,
                                     UserSettingsService,
                                     BrowserUtil,
                                     ResizeImage,
                                     startImageCropperEvent,
                                     ImageSourceMedia) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/uploadImage/uploadImage.html',
      scope : {
        uploadCallback : '=',
        cancelCallback : '=',
        cropperWidth : '=',
        cropperHeight : '='
      },
      link: function($scope) {

        $scope.$on(startImageCropperEvent, function(event, image, imageSourceMedia) {
          openImageCropper(image, imageSourceMedia);
        });

        function openImageCropper(croppedImage, imageSourceMedia) {
          $modal.open({
            templateUrl: 'app/directives/uploadImage/uploadImage.cropper.html',
            controller: 'CropImageController',
            size: 'lg',
            animation: false,
            backdrop: 'static',
            scope: $scope,
            windowClass: 'crop-image-modal',
            resolve: {
              image: ['$q', function($q) {
                var deferred = $q.defer();
                if(typeof croppedImage === 'string') {
                  var img = new Image();
                  img.src = croppedImage;
                  img.onload = function() {
                    deferred.resolve(ResizeImage(img));
                  }
                } else {
                  deferred.resolve(ResizeImage(croppedImage));
                }
                return deferred.promise;
              }],
              imageSourceMedia : function() {
                return imageSourceMedia;
              },
              cropDimensions : function() {
                return {
                  width : $scope.cropperWidth ? $scope.cropperWidth : 510,
                  height : $scope.cropperHeight ? $scope.cropperHeight : 510
                }
              },
              uploadCallback : function() {return $scope.uploadCallback },
              cancelCallback : function() {return $scope.cancelCallback }
            }
          });
        }

        $scope.$watch('files', function(files) {
          if (files && files.length === 1) {
            $scope.readImage(files[0]);
          }
        });

        $scope.readImage = function(file) {
          var reader = new FileReader();

          reader.onload = function(event) {
            openImageCropper(event.target.result, ImageSourceMedia.FILE_SYSTEM)
          };

          reader.onerror = function(error) {
            alert('Device not supported');
          };

          reader.readAsDataURL(file);
        };
      }
    }
  })

  .controller('CropImageController', function($scope,
                                              $modalInstance,
                                              $timeout,
                                              $window,
                                              UserSettingsService,
                                              image,
                                              imageSourceMedia,
                                              cropDimensions,
                                              uploadCallback,
                                              cancelCallback,
                                              MessageTypes) {

    $scope.image = image;
    $scope.submitting = false;

    function closeCropper() {
      $modalInstance.dismiss();
    }

    function getCanvasDataURL() {
      return cropperElement().cropper('getCroppedCanvas').toDataURL();
    }

    function cropperElement() {
      return angular.element('.crop-image > img');
    }

    var cropBoxSquareWidth = $window.innerWidth > cropDimensions.width ? cropDimensions.width : $window.innerWidth;
    var cropBoxSquareHeight = $window.innerHeight > cropDimensions.height ? cropDimensions.height :  $window.innerHeight;

    var left = $window.innerWidth / 2 - cropBoxSquareWidth / 2;
    var top = $window.innerHeight / 2 - cropBoxSquareHeight / 2;

    $scope.message = {
      key : 'upload.privacyMessage',
      messageType : MessageTypes.INFO
    }


    $scope.imgLoaded = function() {
      cropperElement().cropper({
        strict: false,
        guides: false,
        highlight: false,
        dragCrop: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        mouseWheelZoom: false,
        touchDragZoom: false,
        built: function() {
          cropperElement().cropper('setCropBoxData', {
            width: cropBoxSquareWidth,
            height: cropBoxSquareHeight,
            left: left,
            top: top
          })
        }
      });
    };

    $scope.rotate = function(degrees) {
      cropperElement().cropper('rotate', degrees);
    };

    $scope.zoom = function(ratio) {
      cropperElement().cropper('zoom', ratio);
    };

    $scope.ok = function() {
      $scope.submitting = true;
      uploadCallback(getCanvasDataURL().split(',')[1], imageSourceMedia).then(closeCropper);
    };

    $scope.cancel = function() {
      closeCropper();
      cancelCallback();
    }
  })
;
