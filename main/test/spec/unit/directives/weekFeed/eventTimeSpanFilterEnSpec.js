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

describe('Event time span filter', function () {
  var eventTimeSpanFilter;

  beforeEach(module('directives.weekFeed'));
  beforeEach(module('ngResource'));
  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('StateService', { getStateFromDomain: function () { } });
      $provide.constant('LanguageService', { getLocale: function () { return 'en'; } });
    });
  });

  beforeEach(inject(function ($filter) {
    eventTimeSpanFilter = $filter('eventTimeSpan');
  }));

  it('Will show only startdate with english format', function () {
    var startDate = moment([2014, 2, 12, 13, 40]);
    var result = eventTimeSpanFilter(startDate);

    expect(result).toEqual('3/12/2014 13:40');
  });
});
