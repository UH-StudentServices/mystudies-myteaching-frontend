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

angular.module('directives.eventCalendar', [])

  .constant('CalendarViews', {
    'DAY': 'agendaDay',
    'WEEK': 'agendaWeek',
    'MONTH': 'month'
  })

  .service('EventColorService', function() {
    var colors = ['#009e60', '#fcd116', '#9258c8', '#8c0032', '#e5053a',
                  '#fca311', '#00b08c', '#00a39a', '#00bd9d', '#5bbf21',
                  '#e63375'];

    return {
      getColor: function(identifier) {
        var index = identifier % colors.length;

        return colors[index];
      }
    };

  })

  .directive('eventCalendar', function(
    uiCalendarConfig,
    CalendarViews,
    EventColorService,
    $window,
    AnalyticsService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/eventCalendar/eventCalendar.html',
      scope: {
        events: '=',
        calendarView: '='
      },
      replace: true,
      controller: function($scope, $translate) {
        $translate('weekFeed.calendarCustom.list').then(function(listText) {
          $scope.uiConfig = {
            calendar: {
              lang: moment.locale(),
              allDaySlot: false,
              eventRender: function(event, element) {
                element.attr('title', event.tooltip);
              },
              customButtons: {
                myCustomButton: {
                  text: listText,
                  click: function() {
                    $scope.$emit('changeWeekFeedSubTab', {
                      subTab: 'SCHEDULE_LIST'
                    });
                  }
                }
              },
              header: {
                left: 'myCustomButton ' + CalendarViews.DAY + ' ' + CalendarViews.WEEK + ' ' + CalendarViews.MONTH,
                center: 'title',
                right: 'today prev,next'
              },
              columnFormat: 'dd',
              timeFormat: 'HH:mm',
              slotLabelFormat: 'HH:mm',
              buttonIcons: {
                prev: 'calendar-prev',
                next: 'calendar-next'
              },
              defaultView: CalendarViews[$scope.calendarView],
              viewRender: function(view) {
                AnalyticsService.trackShowCalendarView(view.name);
              },
              weekNumbers: true,
              scrollTime: '08:00:00'
            }
          };
        });

        $scope.eventSources = [];

        function getEventTitle(event) {
          var title = event.title;

          if(event.source === 'COURSE_PAGE') {
            title += ', ' + event.courseTitle;
          }

          if(event.locations) {
            title += ', ' + event.locations;
          }

          return title;

        }

        var sortedEvents = _.sortBy($scope.events, 'realisationId');

        var calendarEvents = _.map(sortedEvents, function(event) {

          var startMoment =  event.startDate;
          var endMoment = event.endDate;
          var title = getEventTitle(event);

          var calendarEvent = {
            title: title,
            start: startMoment.toDate(),
            end: endMoment.toDate(),
            color: EventColorService.getColor(event.realisationId),
            tooltip: title,
            url: event.moodleUri ? event.moodleUri : event.courseUri
          };

          return calendarEvent;
        });

        $scope.eventSources.push(calendarEvents);


      }
    };
  });
