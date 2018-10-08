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
    DAY: 'agendaDay',
    WEEK: 'agendaWeek',
    MONTH: 'month'
  })
  .constant('CalendarDefaults', { EVENT_DURATION_HOURS: 1 })

  .service('EventColorService', function () {
    var colors = ['#0098d0', '#005479', '#888888', ' #424242'];

    return {
      getColor: function (identifier) {
        var index = identifier % colors.length;

        return colors[index];
      }
    };
  })

  .directive('eventCalendar', function (
    uiCalendarConfig,
    CalendarViews,
    CalendarDefaults,
    EventColorService,
    $window,
    AnalyticsService,
    LanguageService
  ) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/eventCalendar/eventCalendar.html',
      scope: {
        events: '=',
        currentDate: '=date',
        calendarView: '=',
        fullScreen: '='
      },
      replace: true,
      controller: function ($scope, $translate) {
        $translate([
          'weekFeed.calendarCustom.list',
          'eventCalendar.day',
          'eventCalendar.week',
          'eventCalendar.month'
        ]).then(function (buttonLabels) {
          $scope.uiConfig = {
            calendar: {
              height: 'auto',
              lang: LanguageService.getCurrent(),
              allDaySlot: false,
              eventRender: function (event, element) {
                element.attr('title', event.tooltip);
                if ($scope.calendarView === 'MONTH') {
                  element.css('overflow', 'hidden');
                  element.css('height', '48px');
                }
                element.on('click mouseup', function (e) {
                  // catch click events and middle mouse clicks
                  if (AnalyticsService.isClickOrMiddleButton(e)) {
                    AnalyticsService.trackCalendarLinkClick(event.url);
                  }
                });
              },
              customButtons: {
                listButton: {
                  text: _.capitalize(buttonLabels['weekFeed.calendarCustom.list']),
                  click: function () {
                    $scope.$emit('changeWeekFeedSubTab', { subTab: 'SCHEDULE_LIST' });
                  }
                },
                dayButton: {
                  text: _.capitalize(buttonLabels['eventCalendar.day']),
                  click: function () {
                    $scope.setActiveButton('dayButton');
                    $scope.$emit('changeWeekFeedSubTab', { subTab: 'CALENDAR_DAY' });
                  }
                },
                weekButton: {
                  text: _.capitalize(buttonLabels['eventCalendar.week']),
                  click: function () {
                    $scope.setActiveButton('weekButton');
                    $scope.$emit('changeWeekFeedSubTab', { subTab: 'CALENDAR_WEEK' });
                  }
                },
                monthButton: {
                  text: _.capitalize(buttonLabels['eventCalendar.month']),
                  click: function () {
                    $scope.setActiveButton('monthButton');
                    $scope.$emit('changeWeekFeedSubTab', { subTab: 'CALENDAR_MONTH' });
                  }
                }
              },
              header: {
                left: $scope.fullScreen ? 'dayButton weekButton monthButton'
                  : 'listButton dayButton weekButton monthButton',
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
              viewRender: function (view) {
                $scope.setActiveButton({
                  DAY: 'dayButton',
                  WEEK: 'weekButton',
                  MONTH: 'monthButton'
                }[$scope.calendarView]);
                AnalyticsService.trackShowCalendarView(view.name);
              },
              weekNumbers: true,
              minTime: '07:30:00',
              maxTime: '20:30:00',
              displayEventEnd: true,
              hiddenDays: [0],
              views: { week: { columnFormat: 'dd DD.MM.' } },
              firstDay: 1,
              defaultDate: $scope.currentDate
            }
          };
        });

        $scope.eventSources = [];

        function getEventTitleWithLocationsAndOptimeExtras(event) {
          var title = event.fullEventTitle;

          if (event.locations) {
            event.locations.forEach(function (location) {
              if (location.roomName) {
                title += ', ' + location.roomName;
              }
            });
          }

          if (event.optimeExtrasAsString) {
            title += '\n' + event.optimeExtrasAsString;
          }
          return title;
        }

        $scope.setActiveButton = function setActiveButton(buttonName) {
          var leftDiv = $('.fc-left');

          leftDiv.find('.fc-button').removeClass('fc-state-active');
          leftDiv.find('.fc-' + buttonName + '-button').addClass('fc-state-active');
        };

        function updateEventSources() {
          var sortedEvents = _.sortBy($scope.events, 'realisationId');

          var calendarEvents = sortedEvents.map(function (event) {
            var startMoment = event.startDate;
            var endMoment = event.endDate
              || moment().clone(startMoment).add(CalendarDefaults.EVENT_DURATION_HOURS, 'hours');
            var title = getEventTitleWithLocationsAndOptimeExtras(event);

            return {
              title: title,
              start: startMoment.toDate(),
              end: endMoment.toDate(),
              color: EventColorService.getColor(event.realisationId),
              tooltip: title,
              url: event.moodleUri ? event.moodleUri : event.courseUri
            };
          });

          $scope.eventSources.length = 0;
          $scope.eventSources.push(calendarEvents);
        }

        updateEventSources();
        $scope.$watch('events', function (newEvents, oldEvents) {
          if (newEvents !== oldEvents) {
            updateEventSources();
          }
        });

        $scope.$watch('calendarView', function (newView, oldView) {
          if (newView !== oldView) {
            uiCalendarConfig.calendars.eventCalendar.fullCalendar('changeView', CalendarViews[newView]);
          }
        });

        $scope.$watch('currentDate', function (newDate, oldDate) {
          if (newDate !== oldDate) {
            if (uiCalendarConfig.calendars.eventCalendar) {
              uiCalendarConfig.calendars.eventCalendar.fullCalendar('gotoDate', newDate);
            }
          }
        });

        $scope.$on('eventCalendar.refreshCurrentDate', function () {
          if (uiCalendarConfig.calendars.eventCalendar) {
            // eslint-disable-next-line vars-on-top
            var newCurrentDate = uiCalendarConfig.calendars.eventCalendar.fullCalendar('getDate');

            $scope.currentDate.set(newCurrentDate.toObject());
          }
        });
      }
    };
  });
