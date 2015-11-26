
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

describe('Test', function() {

  it('should run', function() {

  });
});

/*
describe('Toolbar controller', function (){

    beforeEach(module('directives.toolbar'));
    var scope, ctrl, lss, state;

    beforeEach(inject(function($controller, $rootScope, $state, localStorageService) {
        scope = $rootScope;
        lss = localStorageService;
        state = $state;
        ctrl = $controller(ToolbarCtrl, {$scope: scope, $state: state, localStorageService: lss});
    }));

    it('toolbar controller test', function () {
         expect(scope.goToView('STUDENT'));
         expect(lss.cookie.get('SESSION_ROLE')).toBe('STUDENT');

         expect(scope.goToView('TEACHER'));
         expect(lss.cookie.get('SESSION_ROLE')).toBe('TEACHER');

         expect(scope.goToView(''));
         expect(lss.cookie.get('SESSION_ROLE')).toBe('STUDENT');
    });
});*/
