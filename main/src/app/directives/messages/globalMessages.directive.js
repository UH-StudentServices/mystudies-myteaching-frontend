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

  .factory('GlobalMessagesService', function (MessageTypes, $window) {
    var messages = [];


    var Rx = $window.Rx;


    var msgSubject = new Rx.Subject();


    var errorMsg = {
      messageType: MessageTypes.ERROR,
      key: 'globalMessages.errors.genericError'
    };

    return {
      addErrorMessage: function () {
        if (!_.find(messages, errorMsg)) {
          messages.push(errorMsg);
          msgSubject.onNext(messages);
        }
      },
      removeErrorMessage: function () {
        messages = _.without(messages, errorMsg);
        msgSubject.onNext(messages);
      },
      subscribe: function (fn) {
        return msgSubject.subscribe(fn);
      }
    };
  })

  .factory('httpRequestInterceptor', function ($q, GlobalMessagesService) {
    return {
      responseError: function (err) {
        if (err.config && err.config.url
            && err.config.url.indexOf('/api/') > -1 && err.status !== 404) {
          GlobalMessagesService.addErrorMessage();
        }

        return $q.reject(err);
      }
    };
  })

  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
  })

  .directive('globalMessages', function (GlobalMessagesService, MessageTypes) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/messages/globalMessages.html',
      link: function (scope) {
        GlobalMessagesService.subscribe(function (messages) {
          scope.$applyAsync(function () {
            scope.messages = messages;
          });
        });

        _.assign(scope, {
          messages: [],
          dismissMessage: function (message) {
            if (message.messageType === MessageTypes.ERROR) {
              GlobalMessagesService.removeErrorMessage();
            }
          }
        });
      }
    };
  });
