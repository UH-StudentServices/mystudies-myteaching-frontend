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

describe('Event time span filter', function() {

  var eventTimeSpanFilter;

  beforeEach(module('directives.weekFeed'));

  beforeEach(inject(function($filter) {
    eventTimeSpanFilter = $filter('eventTimeSpan');
  }));

  it('Will show startdate if dates are identical', inject(function($filter) {
    var startDate = moment([2014, 2, 12, 13, 40]),
        endDate = moment([2014, 2, 12, 13, 40]),
        result = eventTimeSpanFilter(startDate, endDate);

    expect(result).toEqual('12.03.2014 13:40');
  }));

  it('Will show startdate without hours if dates are identical and hours are not included',
    inject(function($filter) {
      var startDate = moment([2014, 2, 12]),
          endDate = moment([2014, 2, 12]),
          result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014');
    }));

  it('Will show startdate with hours span if dates are identical with different hours',
    inject(function($filter) {
      var startDate = moment([2014, 2, 12, 13, 40]),
          endDate = moment([2014, 2, 12, 14, 40]),
          result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014 13:40 - 14:40');
    }));

  it('Will show full time span if dates are not identical', inject(function($filter) {
    var startDate = moment([2014, 2, 12, 13, 40]),
        endDate = moment([2014, 2, 13, 15, 40]),
        result = eventTimeSpanFilter(startDate, endDate);

    expect(result).toEqual('12.03.2014 13:40 - 13.03.2014 15:40');
  }));

  it('Will show full time span without hours if dates are not identical and hours are not included',
    inject(function($filter) {
      var startDate = moment([2014, 2, 12]),
          endDate = moment([2014, 2, 13]),
          result = eventTimeSpanFilter(startDate, endDate);

      expect(result).toEqual('12.03.2014 - 13.03.2014');
    }));
});
