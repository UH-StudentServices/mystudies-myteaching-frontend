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
  .constant('AvatarImageSize', 510)
  .constant('CropperMargin', 30)
  .constant('ImageSourceMedia', {
    WEBCAM: 'webcam',
    FILE_SYSTEM: 'fileSystem'
  })

  .factory('MaxImageDimensions', function (BrowserUtil, MaxImageDimensionsDesktop,
    MaxImageDimensionsMobile) {
    return {
      get: function () {
        return BrowserUtil.isMobile() ? MaxImageDimensionsMobile : MaxImageDimensionsDesktop;
      }
    };
  })

  .constant('startImageCropperEvent', 'startImageCropperEvent')

  .factory('ResizeImageService', function (MaxImageDimensions) {
    function getDimensions(image) {
      var width = image.videoWidth ? image.videoWidth : image.width;


      var height = image.videoHeight ? image.videoHeight : image.height;


      var dimensions = { width: width, height: height };


      var currentMaxDimension = Math.max(width, height);


      var maxImageDimensions = MaxImageDimensions.get();

      if (currentMaxDimension > maxImageDimensions) {
        var factor = maxImageDimensions / currentMaxDimension;

        dimensions.resizedWidth = width * factor;
        dimensions.resizedHeight = height * factor;
      }

      return dimensions;
    }

    return {
      resizeImage: function (image) {
        var dimensions = getDimensions(image);


        var canvas = document.createElement('canvas');


        var sWidth = dimensions.width;


        var sHeight = dimensions.height;


        var dWidth = dimensions.resizedWidth ? dimensions.resizedWidth : dimensions.width;


        var dHeight = dimensions.resizedHeight ? dimensions.resizedHeight : dimensions.height;

        canvas.width = dWidth;
        canvas.height = dHeight;
        canvas.getContext('2d').drawImage(image, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight);

        return canvas.toDataURL();
      }
    };
  })

  .directive('uploadImage', function ($uibModal,
    $window,
    Camera,
    UserSettingsService,
    BrowserUtil,
    ResizeImageService,
    startImageCropperEvent,
    ImageSourceMedia,
    AvatarImageSize,
    CropperMargin) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/uploadImage/uploadImage.html',
      scope: {
        uploadCallback: '=',
        cancelCallback: '=',
        cropperWidth: '=',
        cropperHeight: '=',
        cropToSquare: '='
      },
      link: function ($scope) {
        $scope.$on(startImageCropperEvent, function (event, image, imageSourceMedia) {
          openImageCropper(image, imageSourceMedia);
        });

        function openImageCropper(croppedImage, imageSourceMedia) {
          $uibModal.open({
            templateUrl: 'app/directives/uploadImage/uploadImage.cropper.html',
            controller: 'CropImageController',
            size: 'lg',
            animation: false,
            backdrop: 'static',
            scope: $scope,
            windowClass: 'crop-image-modal',
            resolve: {
              image: ['$q', function ($q) {
                var deferred = $q.defer();


                var img;

                if (typeof croppedImage === 'string') {
                  img = new Image();

                  img.src = croppedImage;
                  img.onload = function () {
                    deferred.resolve(ResizeImageService.resizeImage(img));
                  };
                } else {
                  deferred.resolve(ResizeImageService.resizeImage(croppedImage));
                }

                return deferred.promise;
              }],
              imageSourceMedia: function () {
                return imageSourceMedia;
              },
              cropDimensions: function () {
                var cropBoxWidth = $scope.cropperWidth ? $scope.cropperWidth : AvatarImageSize;


                var cropBoxHeight = $scope.cropperHeight ? $scope.cropperHeight : AvatarImageSize;

                // Add some margin for better UI
                if ($window.innerWidth < cropBoxWidth + CropperMargin) {
                  cropBoxWidth = $window.innerWidth - CropperMargin;
                }
                if ($window.innerHeight < cropBoxWidth + CropperMargin) {
                  cropBoxHeight = $window.innerHeight - CropperMargin;
                }

                if ($scope.cropToSquare) {
                  cropBoxWidth = Math.min(cropBoxWidth, cropBoxHeight);
                  cropBoxHeight = Math.min(cropBoxWidth, cropBoxHeight);
                }

                return {
                  width: cropBoxWidth,
                  height: cropBoxHeight
                };
              },
              uploadCallback: function () {
                return $scope.uploadCallback;
              },
              cancelCallback: function () {
                return $scope.cancelCallback;
              }
            }
          });
        }

        $scope.$watch('files', function (files) {
          if (files && files.length === 1) {
            $scope.readImage(files[0]);
          }
        });

        $scope.readImage = function (file) {
          var reader = new FileReader();

          reader.onload = function (event) {
            openImageCropper(event.target.result, ImageSourceMedia.FILE_SYSTEM);
          };

          reader.onerror = function (error) {
            alert('Device not supported');
          };

          reader.readAsDataURL(file);
        };
      }
    };
  })

  .controller('CropImageController', function ($scope,
    $uibModalInstance,
    $timeout,
    $window,
    UserSettingsService,
    image,
    imageSourceMedia,
    cropDimensions,
    uploadCallback,
    cancelCallback,
    MessageTypes,
    CropperMargin) {
    $scope.image = image;
    $scope.submitting = false;

    function closeCropper() {
      $uibModalInstance.dismiss();
    }

    function getCanvasDataURL() {
      return cropperElement().cropper('getCroppedCanvas').toDataURL();
    }

    function cropperElement() {
      return angular.element('.crop-image > img');
    }

    var left = $window.innerWidth / 2 - cropDimensions.width / 2;


    var top = $window.innerHeight / 2 - cropDimensions.height / 2;

    $scope.message = {
      key: 'upload.privacyMessage',
      messageType: MessageTypes.INFO
    };

    $scope.imgLoaded = function () {
      cropperElement().cropper({
        strict: false,
        guides: false,
        highlight: false,
        dragCrop: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        mouseWheelZoom: false,
        touchDragZoom: false,
        built: function () {
          cropperElement().cropper('setCropBoxData', {
            width: cropDimensions.width,
            height: cropDimensions.height,
            left: left,
            top: top
          });
        }
      });
    };

    $scope.rotate = function (degrees) {
      cropperElement().cropper('rotate', degrees);
    };

    $scope.zoom = function (ratio) {
      cropperElement().cropper('zoom', ratio);
    };

    $scope.ok = function () {
      $scope.submitting = true;
      uploadCallback(getCanvasDataURL().split(',')[1], imageSourceMedia).then(closeCropper);
    };

    $scope.cancel = function () {
      closeCropper();
      cancelCallback();
    };
  });
