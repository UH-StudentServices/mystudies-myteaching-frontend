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

describe('StateChangeService', function() {

  var StateChangeService,
      $q,
      $rootScope,
      rootStateName,
      sessionResponse,
      Role,
      State;

  function sessionResponseWithRoles(roles) {
    sessionResponse = $q.when({roles: roles});
  }

  function testChangeStateAvailableTo(state, roles, expectedResult, done) {
    rootStateName = state;
    sessionResponseWithRoles(roles);

    StateChangeService.changeStateAvailableTo().then(function(state) {
      expect(state).toEqual(expectedResult);
      done();
    });
    $rootScope.$digest();
  }

  beforeEach(module('services.stateChange'));

  beforeEach(module(function($provide) {
    $provide.value('SessionService', {
      getSession: function() {
        return sessionResponse;
      }
    });
    $provide.value('localStorageService', {
      cookie: {set: function() {}}
    });
    $provide.value('StateService', {
      getRootStateName: function() {
        return rootStateName;
      }
    });
  }));

  beforeEach(inject(function(_$rootScope_, _StateChangeService_, _$q_, _Role_, _State_) {
    StateChangeService = _StateChangeService_;
    Role = _Role_;
    State = _State_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('Will not allow state change if user has only Student role', function(done) {
    testChangeStateAvailableTo(State.MY_STUDIES, [Role.STUDENT], null, done);
  });

  it('Will not allow state change if user has only Teacher role', function(done) {
    testChangeStateAvailableTo(State.MY_TEACHINGS, [Role.TEACHER], null, done);
  });

  it('Will allow state change to My studies if user has ' +
      'Teacher and Student roles and he is in My teachings state',
    function(done) {
      testChangeStateAvailableTo(
        State.MY_TEACHINGS,
        [Role.STUDENT, Role.TEACHER],
        State.MY_STUDIES,
        done);
    });

  it('Will allow state change to My teachings if user has ' +
      'Teacher and Student roles and he is in My studies state',
    function(done) {
      testChangeStateAvailableTo(
        State.MY_STUDIES,
        [Role.STUDENT, Role.TEACHER],
        State.MY_TEACHINGS, done);
    });
});