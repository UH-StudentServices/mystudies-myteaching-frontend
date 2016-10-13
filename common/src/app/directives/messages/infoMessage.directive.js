angular.module('directives.infoMessage', ['directives.message', 'services.configuration'])
  .directive('infoMessage', function(MessageTypes, Configuration) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/messages/infoMessage.html',
      scope: {
        environments: '=',
        messageKey: '@'
      },
      link: function(scope) {
        if (_.includes(scope.environments, Configuration.environment)) {
          scope.message = {
            messageType: MessageTypes.INFO,
            key: scope.messageKey
          };
        }
      }
    };
  });