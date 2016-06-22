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

angular.module('directives.globalMessages',
  ['directives.message'])

  .factory('globalMessagesService', function(MessageTypes) {
    var messages = [],
        lastUpdate;

    function addMessage(message) {
      messages.push(message);
      lastUpdate = new Date().getTime();
    }

    return {
      addErrorMessage: function(err) {
        var messageQuery = {messageType: MessageTypes.ERROR, active: true};

        if (!_.find(messages, messageQuery)) {
          addMessage(_.extend(messageQuery, {key: 'globalMessages.errors.genericError'}));
        }
      },
      addStatusMessage: function() {},
      addInfomessage: function() {},
      getMessages: function() {
        return messages;
      },
      getLastUpdate: function() {
        return lastUpdate;
      }
    };
  })

  .factory('httpRequestInterceptor', function($q, globalMessagesService) {
    return {
      'responseError': function(err) {
        if (err.config && err.config.url &&
           err.config.url.indexOf('/api/') > -1 && err.status !== 404) {
          globalMessagesService.addErrorMessage(err);
        }

        return $q.reject(err);
      }
    };
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
  })

  .directive('globalMessages', function(globalMessagesService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/messages/globalMessages.html',
      link: function($scope) {
        $scope.messages = [];
        $scope.$watch(function() {
          return globalMessagesService.getLastUpdate();
        }, function() {
          $scope.messages = globalMessagesService.getMessages();
        });

        $scope.dismissMessage = function(message) {
          message.active = false;
        };
      }
    };
  });
