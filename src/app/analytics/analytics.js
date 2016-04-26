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

 angular.module('opintoniAnalytics', [])

  /*
  * Analytics must be injected at least once.
  * If relying on automatic page tracking, do not remove it.
  */
  .run(function(Analytics, SessionService, StateService) {
    SessionService.getFacultyCode().then(function(facultyCode) {
      Analytics.set('dimension1', StateService.getStateFromDomain());
      Analytics.set('dimension2', facultyCode);
    });
  })

  .config(function(AnalyticsProvider) {
    if (window.configuration) {
      AnalyticsProvider.setAccount(
        {
          tracker: window.configuration.googleAnalyticsAccount,
          trackEvent: true
        });
      AnalyticsProvider.trackPages(true);
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.ignoreFirstPageLoad(true);
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }
  })

  .constant('EventCategories', {
    'AVATAR_IMAGE': 'avatarImage',
    'BACKGROUND_IMAGE': 'backgroundImage',
    'EXTERNAL_LINK': 'externalLink',
    'FAVORITES': 'favorites',
    'SITE_ACTIONS': 'siteActions',
    'TODO_ITEMS': 'todoItems',
    'USEFUL_LINKS': 'usefulLinks'
  })

  .constant('EventActions', {
    'ADD': 'add',
    'CHOOSE_DEFAULT': 'chooseDefault',
    'CLICK': 'click',
    'FEEDBACK': 'feedback',
    'MARK_AS_DONE': 'markAsDone',
    'MARK_NOTIFICATION_AS_READ': 'markNotificationAsRead',
    'REMOVE': 'remove',
    'SEARCH': 'search',
    'SHOW_CALENDAR_VIEW': 'showCalendarView',
    'SHOW_WEEK_FEED_TAB': 'showWeekFeedTab',
    'START_TOUR': 'startTour',
    'SUBSCRIBE_CALENDAR': 'subscribeCalendar',
    'UPLOAD': 'upload'
  })

  .constant('EventLabels', {
    'FLAMMA_NEWS': 'flammaNews'
  })

  .factory('AnalyticsService', function(Analytics, EventCategories, EventActions, EventLabels) {

    function trackEvent(eventCategory, eventAction, value) {
      submitAnalyticsEvent(EventCategories[eventCategory], EventActions[eventAction], value);
    }

    function submitAnalyticsEvent(eventCategory, eventAction, value) {
      validateEventInput(eventCategory, eventAction);
      Analytics.trackEvent(eventCategory, eventAction, value);
    }

    function validateEventInput(eventCategory, eventAction) {
      if(!eventCategory) {
        throw 'Invalid Analytics eventCategory: ' + eventCategory;
      }
      if(!eventAction) {
        throw 'Invalid Analytics eventAction: ' + eventAction;
      }
    }

    return {
      trackEvent:
        trackEvent,
      trackAddFavorite:
        _.partial(submitAnalyticsEvent, EventCategories.FAVORITES, EventActions.ADD),
      trackRemoveFavorite:
        _.partial(submitAnalyticsEvent, EventCategories.FAVORITES, EventActions.REMOVE),
      trackAddUsefulLink:
        _.partial(submitAnalyticsEvent,EventCategories.USEFUL_LINKS, EventActions.ADD),
      trackRemoveUsefulLink:
        _.partial(submitAnalyticsEvent, EventCategories.USEFUL_LINKS, EventActions.REMOVE),
      trackAddTodoItem:
        _.partial(submitAnalyticsEvent, EventCategories.TODO_ITEMS, EventActions.ADD),
      trackRemoveTodoItem:
        _.partial(submitAnalyticsEvent, EventCategories.TODO_ITEMS, EventActions.REMOVE),
      trackTodoItemMarkAsDone:
        _.partial(submitAnalyticsEvent, EventCategories.TODO_ITEMS, EventActions.MARK_AS_DONE),
      trackFlammaNewsUrlClick:
        _.partial(submitAnalyticsEvent, EventCategories.EXTERNAL_LINK, EventActions.CLICK, EventLabels.FLAMMA_NEWS),
      trackSearch:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.SEARCH),
      trackStartTour:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.START_TOUR),
      trackNotificationMarkAsRead:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.MARK_NOTIFICATION_AS_READ),
      trackUploadBackground:
        _.partial(submitAnalyticsEvent, EventCategories.BACKGROUND_IMAGE, EventActions.UPLOAD),
      trackChangeDefaultBackground:
        _.partial(submitAnalyticsEvent, EventCategories.BACKGROUND_IMAGE, EventActions.CHOOSE_DEFAULT),
      trackAddAvatar:
        _.partial(submitAnalyticsEvent, EventCategories.AVATAR_IMAGE, EventActions.ADD),
      trackRemoveAvatar:
        _.partial(submitAnalyticsEvent, EventCategories.AVATAR_IMAGE, EventActions.REMOVE),
      trackSendFeedback:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.FEEDBACK),
      trackCalendarSubscribe:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.SUBSCRIBE_CALENDAR),
      trackShowWeekFeedTab:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.SHOW_WEEK_FEED_TAB),
      trackShowCalendarView:
        _.partial(submitAnalyticsEvent, EventCategories.SITE_ACTIONS, EventActions.SHOW_CALENDAR_VIEW)
    };
  });
