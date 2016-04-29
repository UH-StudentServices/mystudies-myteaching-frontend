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

describe('CourseView', function() {

  var CourseView,
      FeedItemTimeCondition,
      FeedItemSortCondition,
      emptyCoursesInput = [],
      coursesInput = [
        {realisationId: '3', parentId: null, startDate: moment('2010-01-23'), endDate: moment('2010-01-24')},
        {realisationId: '11', parentId: '1', startDate: moment('2010-01-21'), endDate: moment('2010-01-22')},
        {realisationId: '12', parentId: '1', startDate: moment('2010-01-20'), endDate: moment('2010-01-21')},
        {realisationId: '1', parentId: null, startDate: moment('2010-01-24'), endDate: moment('2010-01-25')},
        {realisationId: '2', parentId: null, startDate: moment('2010-01-22'), endDate: moment('2010-01-23')},
        {realisationId: '41', parentId: '4', startDate: moment('2010-01-19'), endDate: moment('2010-01-20')},
        {realisationId: '51', parentId: '5', startDate: moment('2010-01-18'), endDate: moment('2010-01-19')},
        {realisationId: '52', parentId: '5', startDate: moment('2010-01-25'), endDate: moment('2010-01-24')},
        {realisationId: '5', parentId: null, startDate: moment('2010-01-26'), endDate: moment('2010-01-27')}
      ];

  beforeEach(module('directives.weekFeed'));

  beforeEach(inject(function(_CourseView_, _FeedItemTimeCondition_, _FeedItemSortCondition_) {
    CourseView = _CourseView_;
    FeedItemTimeCondition = _FeedItemTimeCondition_;
    FeedItemSortCondition = _FeedItemSortCondition_;
  }));

  function getRealisationIds(courses) {
    return _.map(courses, 'realisationId');
  }

  it('Will return empty array when no courses', function() {
    expect(CourseView.getCourses(emptyCoursesInput, FeedItemTimeCondition.ALL, FeedItemSortCondition.NONE)).toEqual([]);
  });

  it('Will sort all courses by startdate ascending', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.ALL, FeedItemSortCondition.START_DATE_ASC);

    expect(getRealisationIds(courses)).toEqual(['5', '51', '52', '41', '1', '12', '11', '2', '3']);
  });

  it('Will sort all courses by startdate descending', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.ALL, FeedItemSortCondition.START_DATE_DESC);

    expect(getRealisationIds(courses)).toEqual(['5', '52', '51', '3', '2', '1', '11', '12', '41']);
  });

  it('Will sort past courses by startdate descending', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.PAST,
      FeedItemSortCondition.START_DATE_DESC, moment('2010-01-22'));

    expect(getRealisationIds(courses)).toEqual(['1', '12', '41', '5', '51']);
  });

  it('Will sort current courses by startdate ascending', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.CURRENT,
      FeedItemSortCondition.START_DATE_ASC, moment('2010-01-22'));

    expect(getRealisationIds(courses)).toEqual(['1', '11', '2']);
  });

  it('Will sort upcoming courses by startdate ascending', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.UPCOMING,
      FeedItemSortCondition.START_DATE_ASC, moment('2010-01-22'));

    expect(getRealisationIds(courses)).toEqual(['3', '1', '5', '52']);
  });

  it('Will tag courses that have parent as children', function() {
    var courses = CourseView.getCourses(coursesInput, FeedItemTimeCondition.ALL, FeedItemSortCondition.START_DATE_DESC);

    expect(getRealisationIds(_.filter(courses,'showAsChild'))).toEqual(['52', '51', '11', '12']);
  });
});