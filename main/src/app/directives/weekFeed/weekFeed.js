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

angular.module('directives.weekFeed', [
  'filters.moment',
  'directives.message',
  'directives.subscribeEvents',
  'directives.eventCalendar',
  'directives.weekFeed.feedItem',
  'services.userPreferences',
  'services.state',
  'utils.loader'
])

  .constant('FeedItemTimeCondition', {
    'ALL': 'ALL',
    'UPCOMING': 'UPCOMING',
    'NOT_ENDED': 'NOT_ENDED',
    'CURRENT': 'CURRENT',
    'CURRENT_OR_UPCOMING': 'CURRENT_OR_UPCOMING',
    'PAST': 'PAST'
  })

  .constant('FeedItemSortCondition', {
    'NONE': 'NONE',
    'START_DATE_ASC': 'START_DATE_ASC',
    'START_DATE_DESC': 'START_DATE_DESC'
  })

  .factory('FeedMessages', function(
    MessageTypes,
    WeekFeedMessageKeys) {

    function getEventsMessage(courses, events, filteredItems, selectedTab, selectedSubTab) {
      return getItemsMessage(events, filteredItems, selectedTab, selectedSubTab);
    }

    function getCoursesMessage(courses, events, filteredItems, selectedTab, selectedSubTab) {
      return getItemsMessage(courses, filteredItems, selectedTab, selectedSubTab);
    }

    function getCalendarMessage(courses, events, filteredItems, selectedTab) {
      if (!events) {
        return getErrorMessage(selectedTab);
      }
    }

    function getItemsMessage(items, filteredItems, selectedTab, selectedSubTab) {
      if (!items) {
        return getErrorMessage(selectedTab);
      } else if (!filteredItems.length) {
        return getInfoMessage(selectedTab, selectedSubTab);
      }
    }

    function getInfoMessage(selectedTab, selectedSubTab) {
      return {
        messageType: MessageTypes.INFO,
        key: _.get(WeekFeedMessageKeys, [selectedTab, MessageTypes.INFO, selectedSubTab])
      };
    }

    function getErrorMessage(selectedTab) {
      return {
        messageType: MessageTypes.ERROR,
        key: _.get(WeekFeedMessageKeys, [selectedTab, MessageTypes.ERROR])
      };
    }

    return {
      getEventsMessage: getEventsMessage,
      getCoursesMessage: getCoursesMessage,
      getCalendarMessage: getCalendarMessage
    };
  })

  .factory('CourseView', function($filter) {

    function CourseGroup(groupId, parent, children) {
      this.parent = parent;
      this.children = children;
      this.groupId = groupId;
    }

    function createNewCourseGroup(groupId, parent, children, groupsById, groups) {
      var newGroup = new CourseGroup(groupId, parent, children);

      groupsById[groupId] = newGroup;
      groups.push(newGroup);
    }

    function addParentCourseToGroup(group, course, hasChildren, groupsByParentId, groups) {
      if (group) {
        group.parent = course;
      } else if (!hasChildren) {
        createNewCourseGroup(course.realisationId, course, [], groupsByParentId, groups);
      }
    }

    function addChildCourseToGroup(group, course, groupsByParentId, groups) {
      if (group && group.children) {
        group.children.push(course);
      } else {
        createNewCourseGroup(course.parentId, null, [course], groupsByParentId, groups);
      }
    }

    function groupCourses(courses) {
      var groupsByParentId = {},
          groups = [],
          courseParentsWithChildren = _.filter(courses, function(course) {
            return !course.parentId && _.some(courses, {parentId: course.realisationId});
          }),
          hasChildren;

      _.forEach(courses, function(course) {
        if (course.parentId) {
          addChildCourseToGroup(
            groupsByParentId[course.parentId],
            course,
            groupsByParentId,
            groups);
        } else {
          hasChildren = _.some(courseParentsWithChildren, {realisationId: course.realisationId});
          addParentCourseToGroup(
            groupsByParentId[course.realisationId],
            course,
            hasChildren,
            groupsByParentId,
            groups);
        }
      });
      return groups;
    }

    function addParentsToGroups(courseGroups, courses) {
      var parents = _.filter(courses, {parentId: null}),
          parentsById = _.mapKeys(parents, 'realisationId');

      _.forEach(courseGroups, function(group) {
        if (!group.parent) {
          group.parent = _.get(parentsById, group.groupId);
        }
      });
      return courseGroups;
    }

    function flattenGroups(groups) {
      var courses = [];

      _.forEach(groups, function(group) {
        if (group.parent) {
          courses.push(group.parent);
        }
        courses = courses.concat(group.children);
      });

      return courses;
    }

    function tagChildCourses(groups) {
      _.forEach(groups, function(group) {
        if (group.parent) {
          _.forEach(group.children, function(child) {
            child.showAsChild = true;
          });

          var lastChild = _.last(group.children);

          if (lastChild) {
            lastChild.showAsLastChild = true;
          }
        }
      });

      return groups;
    }

    function getCourses(courses, feedItemTimeCondition, feedItemSortCondition, now) {
      var filteredFeedItems = $filter('filterFeedItems')(courses, feedItemTimeCondition, now),
          sortedFeedItems = $filter('sortFeedItems')(filteredFeedItems, feedItemSortCondition),
          groups = groupCourses(sortedFeedItems),
          groupsWithParents = addParentsToGroups(groups, courses),
          groupsWithTaggedChildCourses = tagChildCourses(groupsWithParents);

      return flattenGroups(groupsWithTaggedChildCourses);
    }

    return {
      getCourses: getCourses
    };
  })

  .factory('Tabs', function(
    $filter,
    CourseView,
    FeedItemTimeCondition,
    FeedItemSortCondition,
    FeedMessages) {

    var getEventsMessage = FeedMessages.getEventsMessage,
        getCoursesMessage = FeedMessages.getCoursesMessage,
        getCalendarMessage = FeedMessages.getCalendarMessage;

    function getItems(items, feedItemTimeCondition, feedItemSortCondition) {
      var filteredFeedItems = $filter('filterFeedItems')(items, feedItemTimeCondition);

      return $filter('sortFeedItems')(filteredFeedItems, feedItemSortCondition);
    }

    return {
      'SCHEDULE': {
        key: 'SCHEDULE',
        translateKey: 'weekFeed.timetable',
        subTabs: {
          'SCHEDULE_LIST': {
            key: 'SCHEDULE_LIST',
            hideSubTabs: false,
            translateKey: 'weekFeed.calendarCustom.list',
            getItems: function(courses, events) {
              return getItems(events, FeedItemTimeCondition.CURRENT_OR_UPCOMING, FeedItemSortCondition.NONE);
            },
            getMessage: getEventsMessage,
          },
          'CALENDAR_DAY': {
            key: 'CALENDAR_DAY',
            hideSubTabs: true,
            calendarView: 'DAY',
            translateKey: 'eventCalendar.day',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          },
          'CALENDAR_WEEK': {
            key: 'CALENDAR_WEEK',
            hideSubTabs: true,
            calendarView: 'WEEK',
            translateKey: 'eventCalendar.week',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          },
          'CALENDAR_MONTH': {
            key: 'CALENDAR_MONTH',
            hideSubTabs: true,
            calendarView: 'MONTH',
            translateKey: 'eventCalendar.month',
            getItems: function(courses, events) {
              return [];
            },
            getMessage: getCalendarMessage
          }
        },
        showFirstItemImage: true
      },
      'COURSES': {
        key: 'COURSES',
        translateKey: 'general.courses',
        subTabs: {
          'CURRENT_COURSES': {
            key: 'CURRENT_COURSES',
            hideSubTabs: false,
            translateKey: 'general.current',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'UPCOMING_COURSES': {
            key: 'UPCOMING_COURSES',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_COURSES': {
            key: 'PAST_COURSES',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      },
      'STUDENT_EXAMS': {
        key: 'STUDENT_EXAMS',
        translateKey: 'general.exams',
        subTabs: {
          'UPCOMING_EXAMS': {
            key: 'UPCOMING_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return getItems(_.filter(events, {type: 'EXAM'}),
                FeedItemTimeCondition.NOT_ENDED, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getEventsMessage
          },
          'PAST_EXAMS': {
            key: 'PAST_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return getItems(_.filter(events, {type: 'EXAM'}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getEventsMessage
          },
        }
      },
      'TEACHING': {
        key: 'TEACHING',
        translateKey: 'general.teaching',
        subTabs: {
          'CURRENT_TEACHER_COURSES': {
            key: 'CURRENT_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.current',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.CURRENT, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'UPCOMING_TEACHER_COURSES': {
            key: 'UPCOMING_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
                FeedItemTimeCondition.UPCOMING, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_TEACHER_COURSES': {
            key: 'PAST_TEACHER_COURSES',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: false}),
              FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      },
      'TEACHER_EXAMS': {
        key: 'TEACHER_EXAMS',
        translateKey: 'general.exams',
        subTabs: {
          'UPCOMING_TEACHER_EXAMS': {
            key: 'UPCOMING_TEACHER_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.upcoming',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.NOT_ENDED, FeedItemSortCondition.START_DATE_ASC);
            },
            getMessage: getCoursesMessage
          },
          'PAST_TEACHER_EXAMS': {
            key: 'PAST_TEACHER_EXAMS',
            hideSubTabs: false,
            translateKey: 'general.past',
            getItems: function(courses, events) {
              return CourseView.getCourses(_.filter(courses, {isExam: true}),
                FeedItemTimeCondition.PAST, FeedItemSortCondition.START_DATE_DESC);
            },
            getMessage: getCoursesMessage
          }
        }
      }
    };
  })

  .constant('TabConfiguration', {
    'opintoni': [
      'SCHEDULE',
      'COURSES',
      'STUDENT_EXAMS'
    ],
    'opetukseni': [
      'SCHEDULE',
      'TEACHING',
      'TEACHER_EXAMS'
    ]
  })

  .filter('filterFeedItems', function(FeedItemTimeCondition) {
    return function(items, filterType, now) {
      var nowMoment = now || moment.utc();

      switch (filterType) {
        case FeedItemTimeCondition.ALL:
          return items;
        case FeedItemTimeCondition.UPCOMING:
          return _.filter(items, function(item) {
            return nowMoment.isBefore(item.startDate);
          });
        case FeedItemTimeCondition.NOT_ENDED:
          return _.filter(items, function(item) {
            return !nowMoment.isAfter(item.endDate);
          });
        case FeedItemTimeCondition.TODAY:
          return _.filter(items, function(item) {
            return nowMoment.startOf('day').isSame(item.startDate.startOf('day'));
          });
        case FeedItemTimeCondition.CURRENT:
          return _.filter(items, function(item) {
            var startDate = item.startDate,
                endDate = item.endDate;

            return nowMoment.isBetween(startDate, endDate) ||
              nowMoment.isSame(startDate) ||
              nowMoment.isSame(endDate);
          });
        case FeedItemTimeCondition.CURRENT_OR_UPCOMING:
          return _.filter(items, function(item) {
            return nowMoment.isBefore(item.endDate);
          });
        case FeedItemTimeCondition.PAST:
          return _.filter(items, function(item) {
            return nowMoment.isAfter(item.endDate);
          });
        default:
          // FIXME: error, anyone?
      }
    };
  })

  .filter('sortFeedItems', function(FeedItemSortCondition) {
    return function(items, filterType) {
      switch (filterType) {
        case FeedItemSortCondition.NONE:
          return items;
        case FeedItemSortCondition.START_DATE_ASC:
          return _.sortBy(items, function(item) {
            return item.startDate.unix();
          });
        case FeedItemSortCondition.START_DATE_DESC:
          return _.sortBy(items, function(item) {
            return -item.startDate.unix();
          });
        default:
          // FIXME: error, anyone?
      }
    };
  })

  .constant('WeekFeedMessageKeys', {
    'SCHEDULE': {
      info: {
        'SCHEDULE_LIST': 'weekFeed.noEvents'
      },
      error: 'weekFeed.errors.errorLoadingEvents'
    },
    'COURSES': {
      info: {
        'CURRENT_COURSES': 'weekFeed.noCourses',
        'UPCOMING_COURSES': 'weekFeed.noCourses',
        'PAST_COURSES': 'weekFeed.noCourses'
      },
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'STUDENT_EXAMS': {
      info: {
        'CURRENT_EXAMS': 'weekFeed.noExams',
        'UPCOMING_EXAMS': 'weekFeed.noExams',
        'PAST_EXAMS': 'weekFeed.noPastExams'
      },
      error: 'weekFeed.errors.errorLoadingExams'
    },
    'TEACHING': {
      info: {
        'CURRENT_TEACHER_COURSES': 'weekFeed.noCurrentTeacherCourses',
        'UPCOMING_TEACHER_COURSES': 'weekFeed.noUpcomingTeacherCourses',
        'PAST_TEACHER_COURSES': 'weekFeed.noPastTeacherCourses'
      },
      error: 'weekFeed.errors.errorLoadingCourses'
    },
    'TEACHER_EXAMS': {
      info: {
        'CURRENT_TEACHER_EXAMS': 'weekFeed.noExams',
        'UPCOMING_TEACHER_EXAMS': 'weekFeed.noExams',
        'PAST_TEACHER_EXAMS': 'weekFeed.noPastExams'
      },
      error: 'weekFeed.errors.errorLoadingExams'
    }
  })

  .constant('InitialVisibleItems', 5)
  .constant('LoaderKey', 'weekFeed')

  .directive('weekFeed', function(
    $q,
    $filter,
    State,
    StateService,
    Tabs,
    TabConfiguration,
    MessageTypes,
    WeekFeedMessageKeys,
    UserPreferencesService,
    AnalyticsService,
    InitialVisibleItems,
    Loader,
    LoaderKey) {

    return {
      restrict: 'E',
      templateUrl: 'app/directives/weekFeed/weekFeed.html',
      scope: {
        coursesPromise: '=',
        eventsPromise: '='
      },
      link: function($scope) {
        var currentStateName = StateService.getRootStateName(),
            tabs = _.pick(Tabs, TabConfiguration[currentStateName]),
            coursesPromise = $scope.coursesPromise,
            eventsPromise = $scope.eventsPromise;

        function updateFeedItems() {
          $scope.feedItems = $scope.selectedSubTab.getItems($scope.courses, $scope.events);
          $scope.message = $scope.selectedSubTab.getMessage(
            $scope.courses,
            $scope.events,
            $scope.feedItems,
            $scope.selectedTab.key,
            $scope.selectedSubTab.key);
        }

        function getFirstTab() {
          return _.find($scope.tabs, {key: _.get(TabConfiguration, [currentStateName, '0'])});
        }

        function getPreferredTab() {
          return _.find($scope.tabs, {
            key: UserPreferencesService.getPreferences().selectedTab
          }) || getFirstTab();
        }

        function getFirstSubTab() {
          return _.find($scope.selectedTab.subTabs, {});
        }

        function mapToResolved(promises) {
          return _.map(promises, function(promise) {
            return promise.catch(function() {
              return true;
            });
          });
        }

        function updateEvents() {
          return eventsPromise.then(function(events) {
            $scope.events = events;
            return events;
          });
        }

        function updateCourses() {
          return coursesPromise.then(function(courses) {
            $scope.courses = courses;
            return courses;
          });
        }

        $scope.Tabs = Tabs;
        $scope.tabs = tabs;
        $scope.feedItems = [];
        $scope.numberOfVisibleItems = InitialVisibleItems;
        $scope.MessageTypes = MessageTypes;
        $scope.selectedTab = getPreferredTab();
        $scope.subTabs = $scope.selectedTab.subTabs;
        $scope.selectedSubTab = getFirstSubTab();
        $scope.hideSubTabs = $scope.selectedSubTab.hideSubTabs;

        Loader.start(LoaderKey);

        $q.all(mapToResolved([updateCourses(), updateEvents()]))
          .finally(function() {
            updateFeedItems();
            Loader.stop(LoaderKey);
          });

        $scope.header = $filter('translate')(currentStateName === State.MY_STUDIES ?
          'weekFeed.nowStudying' :
          'weekFeed.nowTeaching');

        $scope.selectTab = function selectTab(selectedTab) {
          $scope.numberOfVisibleItems = InitialVisibleItems;
          $scope.selectedTab = selectedTab;
          $scope.subTabs = $scope.selectedTab.subTabs;
          $scope.selectedSubTab = getFirstSubTab();
          $scope.hideSubTabs = $scope.selectedSubTab.hideSubTabs;
          updateFeedItems();
          UserPreferencesService.addProperty('selectedTab', selectedTab.key);
          AnalyticsService.trackShowWeekFeedTab(selectedTab.key);
        };

        $scope.selectSubTab = function selectSubTab(selectedSubTab) {
          $scope.numberOfVisibleItems = InitialVisibleItems;
          $scope.selectedSubTab = selectedSubTab;
          $scope.hideSubTabs = selectedSubTab.hideSubTabs;
          $scope.calendarView = selectedSubTab.calendarView;
          updateFeedItems();
          AnalyticsService.trackShowWeekFeedTab(selectedSubTab.key);
        };

        $scope.$on('changeWeekFeedSubTab', function(evt, params) {
          $scope.$apply(function() {
            $scope.selectSubTab(_.find($scope.selectedTab.subTabs, {key: params.subTab}));
          });
        });

        $scope.showMore = function showMore() {
          $scope.numberOfVisibleItems += 5;
        };

        $scope.showMoreVisible = function showMoreVisible() {
          return $scope.feedItems.length > $scope.numberOfVisibleItems;
        };

        $scope.getTabClasses = function getTabClasses(tab) {
          return {
            'is-active': tab === $scope.selectedTab
          };
        };

        $scope.getSubTabClasses = function getSubTabClasses(subTab) {
          return {
            'active': subTab === $scope.selectedSubTab
          };
        };

      }
    };
  });
