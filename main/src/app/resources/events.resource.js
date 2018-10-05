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

angular.module('resources.events', ['services.eventUri', 'utils.moment'])

  .factory('EventsResource', function Attainments($resource, EventUriService,
    dateArrayToMomentObject) {
    var studentEventsResource = $resource('/api/private/v1/students/enrollments/events');
    var teacherEventsResource = $resource('/api/private/v1/teachers/enrollments/events');

    var getEvents = function getEvents(resource) {
      return resource.query().$promise.then(function (data) {
        return _.map(data, function (event) {
          event.startDate = dateArrayToMomentObject(event.startDate);
          event.endDate = dateArrayToMomentObject(event.endDate);
          event.locations = _.map(event.locations, function (location) {
            location.googleMapsUri = EventUriService.getGoogleMapsUri(location);
            location.reittiopasEnabled = EventUriService.reittiopasUriCanBeGenerated(event.startDate, location);
            return location;
          });
          return event;
        });
      });
    };

    return {
      getStudentEvents: _.partial(getEvents, studentEventsResource),
      getTeacherEvents: _.partial(getEvents, teacherEventsResource)
    };
  });
