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

angular.module('directives.todoItems', ['resources.todoItems', 'directives.swipe', 'ngAnimate'])
  .constant('Status', {
    OPEN: 'OPEN',
    DONE: 'DONE'
  })
  .directive('todoItems', function (TodoItemsResource, Status, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/pageBanner/todoItems/todoItems.html',
      link: function ($scope) {
        function loadTodoItems() {
          TodoItemsResource.getAll().then(function todoItemsGetAllSuccess(todoItems) {
            $scope.todoItems = todoItems;
            $scope.todoItemsLoaded = true;
          });
        }

        $scope.todoItems = [];
        $scope.newTodoItem = { status: Status.OPEN };
        $scope.Status = Status;

        loadTodoItems();

        $scope.addTodoItem = function () {
          if ($scope.newTodoItem.content) {
            TodoItemsResource.save($scope.newTodoItem).then(function todoItemSaveSuccess() {
              AnalyticsService.trackAddTodoItem();
              $scope.newTodoItem = { status: Status.OPEN };
              loadTodoItems();
            });
          }
        };

        function updateTodoItem(todoItem) {
          var itemIndex = _.findIndex($scope.todoItems, ['id', todoItem.id]);
          $scope.todoItems[itemIndex] = todoItem;
        }

        $scope.markAsDone = function (todoItem) {
          todoItem.status = Status.DONE;
          TodoItemsResource.update(todoItem).then(function todoItemUpdateSuccess(updatedItem) {
            AnalyticsService.trackTodoItemMarkAsDone();
            updateTodoItem(updatedItem);
          });
        };

        $scope.removeTodoItem = function (todoItem) {
          TodoItemsResource.deleteTodoItem(todoItem.id).then(function todoItemDeleteSuccess(data) {
            AnalyticsService.trackRemoveTodoItem();
            $scope.todoItems = data;
          });
        };
      }
    };
  });
