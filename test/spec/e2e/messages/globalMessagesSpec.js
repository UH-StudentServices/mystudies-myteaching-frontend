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

var util = require('../util');
var baseUrl = browser.params.baseUrl;

/*describe('Global messages', function() {

  beforeEach(function() {
    util.loginStudent();
    browser.addMockModule('resources.events', function() {
      angular.module('resources.events', []).factory('EventsResource', function($resource, $q) {
        var resource = $resource('/api/private/v1/test/internalservererror');
        return {
          getStudentEvents : function() {
            var defer = $q.defer();
            resource.query(function() {}, function(err) {
              defer.reject(err);
            });
            return defer.promise;
          }
        }
      });
    });

  });

  it('Will show global error message when api error occurs', function() {
    browser.get(baseUrl);
    expect(element(by.cssContainingText('span', 'Service has some problems at the moment. Some features may not work.')).isPresent()).toEqual(true);
  });

  it('Will show section specific error message', function() {
    browser.get(baseUrl);
    element(by.cssContainingText('a[role="tab"]', 'Upcoming events')).click();
    expect(element(by.cssContainingText('span', 'Future events could not be loaded')).isPresent()).toEqual(true);
  });

  afterEach(function(){browser.clearMockModules});
});*/