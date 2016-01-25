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

angular.module('resources.todoItems', ['utils.moment'])

  .factory('TodoItemsResource', function TodoItemsResource($resource) {
    var todoItemsResource = $resource('/api/private/v1/todoitems/:id', {id: '@id'}, {
      update: {method: 'PUT'},
      delete: {method: 'DELETE', isArray: true}
    });

    function getAll() {
      return todoItemsResource.query().$promise;
    }

    function save(todoItem) {
      return todoItemsResource.save(todoItem).$promise;
    }

    function update(todoItem) {
      return todoItemsResource.update(todoItem).$promise;
    }

    function deleteTodoItem(id) {
      return todoItemsResource.delete({id: id}).$promise;
    }

    return {
      getAll: getAll,
      save: save,
      update: update,
      deleteTodoItem: deleteTodoItem
    };
  });
