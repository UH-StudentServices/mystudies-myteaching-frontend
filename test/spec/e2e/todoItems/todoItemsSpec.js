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

describe('Todo items', function(){

  var util = require('../util');
  var _ = require('lodash');

  var newTodoItemContent = _.uniqueId('Do this and that!');

  var addNewTodoItemButtonSelector = element(by.css('.new-todo-item .add-icon'));
  var newTodoItemSelector = element(by.cssContainingText('li.todo-item', newTodoItemContent));
  var newTodoItemMarkDoneSelector = newTodoItemSelector.element(by.css('.todo-action.fa-check'));
  var newTodoItemChecked = newTodoItemSelector.element(by.css('.done .todo-action.fa-check'));
  var newTodoItemRemoveSelector = newTodoItemSelector.element(by.css('.todo-action.fa-close'));

  it('Is possible to add a new todo item and mark it as checked and remove it.', function(){

    util.loginStudent();

    element(by.model('newTodoItem.content')).sendKeys(newTodoItemContent);

    addNewTodoItemButtonSelector.click();

    util.waitUntilPresent(newTodoItemSelector);

    expect(newTodoItemSelector.isPresent()).toEqual(true);

    newTodoItemMarkDoneSelector.click();

    expect(newTodoItemChecked.isPresent()).toEqual(true);

    newTodoItemRemoveSelector.click();

    util.waitUntilNotPresent(newTodoItemSelector);

    expect(newTodoItemSelector.isPresent()).toEqual(false);
  })

});