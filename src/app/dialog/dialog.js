angular.module('opintoniDialog', ['ui.bootstrap.modal'])

  .factory('Dialog', function($modal, $rootScope){

    function modalDialog(translationKey, okKey, cancelKey, okCallback, cancelCallback) {
      var scope = $rootScope.$new();
      var modalInstance;

      scope.okCallback = function(event) {
        modalInstance.close();
        if(okCallback) {
          okCallback(event);
        }
      }

      scope.cancelCallback = function(event) {
        modalInstance.close();
        if(cancelCallback) {
          cancelCallback(event);
        }
      }

      scope.translationKey = translationKey;
      scope.okKey = okKey;
      scope.cancelKey = cancelKey;

      modalInstance = $modal.open({
        templateUrl: 'app/dialog/modalDialog.html',
        scope: scope,
        windowClass: 'confirm',
        animation: false,
        backdrop: true
      });
    }


    return {
      modalDialog : modalDialog
    }


  })

