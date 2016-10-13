angular.module('directives.demoMessage', ['directives.message'])

  .constant('DEMO_MESSAGE_KEY', 'globalMessages.demoEnvNotice')

  .directive('demoMessage', function(MessageTypes, DEMO_MESSAGE_KEY, Configuration) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/messages/demoMessage.html',
      scope: {
        environments: '='
      },
      link: function(scope) {
        if(_.includes(scope.environments, Configuration.environment)) {
          scope.message = {
            messageType: MessageTypes.INFO,
            key: DEMO_MESSAGE_KEY
          };
        }
      }
    };
  });