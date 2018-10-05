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

describe('Visibility directive', function () {
  var compile; var scope; var
    directiveElem;

  beforeEach(function () {
    module('directives.visibility');
    module(function ($provide) {
      $provide.constant('StateService', { getRootStateName: function () { return 'opintoni'; } });
      $provide.constant('SessionService', {});
      $provide.constant('Configuration', { environment: 'qa' });
    });

    inject(function ($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope.$new();
    });

    directiveElem = getCompiledElement();
  });

  function getCompiledElement() {
    var element = angular.element(
      '<div>'
      + '<span class="student-only" limit-visibility="[\'MY_STUDIES_ONLY\']">Student only</span>'
      + '<span class="dev-and-qa-only" limit-visibility="[\'MY_STUDIES_ONLY\', \'DEV_AND_QA_ONLY\']">'
      + 'Dev and QA only</span>'
      + '<span class="teacher-only" limit-visibility="[\'MY_TEACHINGS_ONLY\']">Teacher only</span>'
      + '</div>'
    );
    var compiledElement = compile(element)(scope);

    scope.$digest();
    return compiledElement;
  }

  it('Element should be visible for student', function () {
    var spanElement = directiveElem.find('.student-only');

    expect(spanElement).toBeDefined();
    expect(spanElement.text()).toEqual('Student only');
  });

  it('Element should be visible for student in QA environment', function () {
    var spanElement = directiveElem.find('.dev-and-qa-only');

    expect(spanElement).toBeDefined();
    expect(spanElement.text()).toEqual('Dev and QA only');
  });

  it('Element should not be visible for student', function () {
    var spanElement = directiveElem.find('.teacher-only');

    expect(spanElement.length).toEqual(0);
  });
});
