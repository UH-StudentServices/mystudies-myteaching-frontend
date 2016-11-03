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
    var colors = ['#0098d0', '#005479', '#888888', ' #424242'];

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
    AnalyticsService,
    LanguageService) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/eventCalendar/eventCalendar.html',
      scope: {
        events: '=',
        calendarView: '=',
        fullScreen: '='
      },
      replace: true,
      controller: function($scope, $translate) {
        $translate('weekFeed.calendarCustom.list').then(function(listText) {
          $scope.uiConfig = {
            calendar: {
              height: 'auto',
              lang: LanguageService.getCurrent(),
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
                left: $scope.fullScreen ?
                  CalendarViews.DAY + ' ' + CalendarViews.WEEK + ' ' + CalendarViews.MONTH :
                  'myCustomButton ' + CalendarViews.DAY + ' ' + CalendarViews.WEEK + ' ' + CalendarViews.MONTH,
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
              minTime: '07:30:00',
              maxTime: '20:30:00',
              displayEventEnd: true,
              hiddenDays: [0],
              views: {
                week: {
                  columnFormat: 'dd DD.MM.'
                }
              },
              firstDay: 1
            }
          };
        });

        $scope.eventSources = [];

        function getEventTitle(event) {
          var title = event.title;

          if (event.source === 'COURSE_PAGE') {
            title += ', ' + event.courseTitle;
          }

          if (event.locations) {
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
