angular.module('utils.loader', ['blockUI'])
  .constant('BlockUITemplate',
    '<div class="block-ui-overlay"></div>' +
    '<div class="block-ui-message-container">' +
      '<div class="content-loader__loader">' +
        '<span class="hy hy-spinner hy-spin"></span>' +
      '</div>' +
    '</div>')

  .config(function(blockUIConfig, BlockUITemplate) {
    blockUIConfig.autoBlock = false;
    blockUIConfig.template = BlockUITemplate;
  })

  .factory('Loader', function($filter, blockUI) {

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