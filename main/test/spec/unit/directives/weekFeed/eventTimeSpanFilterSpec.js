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

describe('Event time span filter', function () {
  var eventTimeSpanFilter;

  beforeEach(module('directives.weekFeed'));
  beforeEach(module('ngResource'));
  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('StateService', { getStateFromDomain: function () { } });
    });
  });

  beforeEach(inject(function ($filter) {
    eventTimeSpanFilter = $filter('eventTimeSpan');
  }));

  it('Will show only startdate if dates are identical', function () {
    var startDate = moment([2014, 2, 12, 13, 40]);


    var endDate = moment([2014, 2, 12, 13, 40]);


    var result = eventTimeSpanFilter(startDate, endDate);

    expect(result).toEqual('12.03.2014 13:40');
  });

  it('Will show only startdate if enddate is not defined', function () {
    var startDate = moment([2014, 2, 12, 13, 40]);


    var result = eventTimeSpanFilter(startDate);

    expect(result).toEqual('12.03.2014 13:40');
  });

  it('Will not show anything if both dates are undefined', function () {
    var result = eventTimeSpanFilter();

    expect(result).toBeUndefined();
  });

  it('Will show startdate without hours if dates are identical and hours are not included',
    function () {
      var startDate = moment([2014, 2, 12]);


      var endDate = moment([2014, 2, 12]);


      var result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014');
    });

  it('Will show startdate with hours span if dates are identical with different hours',
    function () {
      var startDate = moment([2014, 2, 12, 13, 40]);


      var endDate = moment([2014, 2, 12, 14, 40]);


      var result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014 13:40 - 14:40');
    });

  it('Will show full time span if dates are not identical', function () {
    var startDate = moment([2014, 2, 12, 13, 40]);


    var endDate = moment([2014, 2, 13, 15, 40]);


    var result = eventTimeSpanFilter(startDate, endDate);

    expect(result).toEqual('12.03.2014 13:40 - 13.03.2014 15:40');
  });

  it('Will show full time span without hours if dates are not identical and hours are not included',
    function () {
      var startDate = moment([2014, 2, 12]);


      var endDate = moment([2014, 2, 13]);


      var result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014 - 13.03.2014');
    });
});
