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

describe('UnicafeOpenDaysParser', function () {
  var UnicafeOpenDaysParser;

  var unicafeDataRegular = {
    information: {
      business: {
        exception: [
          {
            from: '1.6',
            to: '30.8',
            closed: false
          }],
        regular: [
          { when: ['Ma', 'Ti', 'Ke', 'To', false, false, false] },
          { when: ['previous', 'previous', 'previous', 'previous', 'Pe', false, false] }
        ]
      }
    }
  };

  var unicafeDataException = {
    information: {
      business: {
        exception: [
          {
            from: '1.6',
            to: '30.8',
            closed: true
          }],
        regular: [
          { when: ['Ma', 'Ti', 'Ke', 'To', false, false, false] },
          { when: ['previous', 'previous', 'previous', 'previous', 'Pe', false, false] }
        ]
      }
    }
  };

  function momentFromNextWeekStart(offsetDays) {
    return moment()
      .add(1, 'weeks')
      .startOf('isoWeek')
      .add(offsetDays, 'days');
  }

  var monday = momentFromNextWeekStart(0);
  var tuesday = momentFromNextWeekStart(1);
  var wednesday = momentFromNextWeekStart(2);
  var thursday = momentFromNextWeekStart(3);
  var friday = momentFromNextWeekStart(4);
  var saturday = momentFromNextWeekStart(5);
  var sunday = momentFromNextWeekStart(6);

  beforeEach(function () {
    module(function ($provide) {
      $provide.constant('AnalyticsService', { trackAddFavorite: function () { } });
      $provide.constant('SessionService', { getFacultyCode: function () { return { then: function () {} }; } });
      $provide.constant('StateService', { getStateFromDomain: function () { } });
      $provide.constant('Analytics', { set: function () { } });
    });
    module('directives.favorites.unicafe');

    inject(function (_UnicafeOpenDaysParser_) {
      UnicafeOpenDaysParser = _UnicafeOpenDaysParser_;
    });
  });

  it('Should show the restaurant is regularly open from monday to friday', function () {
    _.each([monday, tuesday, wednesday, thursday, friday], function (m) {
      expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataRegular, m)).toEqual(false);
    });
  });

  it('Should show the restaurant is regularly closed from saturday to sunday', function () {
    _.each([saturday, sunday], function (d) {
      expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataRegular, moment(d, 'DD.M')))
        .toEqual(true);
    });
  });

  it('Should show the restaurant is closed by exception during 1.6 - 30.8', function () {
    expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataException, moment('20.8', 'DD.M')))
      .toEqual(true);
  });
});
