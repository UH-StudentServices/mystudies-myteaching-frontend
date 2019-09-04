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

angular.module('opintoniAnalytics', [
  'provider.analyticsAccounts',
  'services.affiliations',
  'services.state',
  'angular-google-analytics'
])

  /*
  * Analytics must be injected at least once.
  * If relying on automatic page tracking, do not remove it.
  */
  .run(function (Analytics, AffiliationsService, StateService) {
    AffiliationsService.getFacultyCode().then(function (facultyCode) {
      Analytics.set('dimension1', StateService.getStateFromDomain());
      Analytics.set('dimension2', facultyCode);
    });
  })

  .config(function (AnalyticsProvider, AnalyticsAccountsProvider) {
    AnalyticsProvider.setAccount(AnalyticsAccountsProvider.$get());
    AnalyticsProvider.trackPages(true);
    AnalyticsProvider.useAnalytics(true);
    AnalyticsProvider.ignoreFirstPageLoad(true);
    AnalyticsProvider.setPageEvent('$stateChangeSuccess');
  })

  .constant('EventCategories', {
    AVATAR_IMAGE: 'avatarImage',
    BACKGROUND_IMAGE: 'backgroundImage',
    EXTERNAL_LINK: 'externalLink',
    FAVORITES: 'favorites',
    SITE_ACTIONS: 'siteActions',
    TODO_ITEMS: 'todoItems',
    USEFUL_LINKS: 'usefulLinks',
    WEEK_FEED: 'weekFeed',
    PAGE_BANNER: 'pageBanner'
  })

  .constant('EventActions', {
    ADD: 'add',
    CHOOSE_DEFAULT: 'chooseDefault',
    CLICK: 'click',
    FEEDBACK: 'feedback',
    MARK_AS_DONE: 'markAsDone',
    MARK_NOTIFICATION_AS_READ: 'markNotificationAsRead',
    REMOVE: 'remove',
    SHOW_CALENDAR_VIEW: 'showCalendarView',
    SHOW_WEEK_FEED_TAB: 'showWeekFeedTab',
    SUBSCRIBE_CALENDAR: 'subscribeCalendar',
    UPLOAD: 'upload',
    VISIBLE_ON_PAGE_LOAD: 'visibleOnPageLoad',
    BROWSE: 'browse'
  })

  .constant('EventLabels', {
    VISIBLE: 'visible',
    HIDDEN: 'hidden'
  })

  .factory('AnalyticsService', function (Analytics, EventCategories, EventActions) {
    function isClickOrMiddleButton(event) {
      return event.type === 'click' || event.which === 2;
    }

    function validateEventInput(eventCategory, eventAction) {
      if (!eventCategory) {
        throw Error('Invalid Analytics eventCategory: ' + eventCategory);
      }
      if (!eventAction) {
        throw Error('Invalid Analytics eventAction: ' + eventAction);
      }
    }

    function submitAnalyticsEvent(eventCategory, eventAction, value) {
      validateEventInput(eventCategory, eventAction);
      Analytics.trackEvent(eventCategory, eventAction, value);
    }

    function trackEvent(eventCategory, eventAction, value) {
      submitAnalyticsEvent(EventCategories[eventCategory], EventActions[eventAction], value);
    }

    function getSubmitEventFn(eventCategory, eventAction) {
      return _.partial(submitAnalyticsEvent, eventCategory, eventAction);
    }

    return {
      isClickOrMiddleButton: isClickOrMiddleButton,
      trackEvent: trackEvent,
      trackAddFavorite:
        getSubmitEventFn(EventCategories.FAVORITES, EventActions.ADD),
      trackRemoveFavorite:
        getSubmitEventFn(EventCategories.FAVORITES, EventActions.REMOVE),
      trackAddUsefulLink:
        getSubmitEventFn(EventCategories.USEFUL_LINKS, EventActions.ADD),
      trackRemoveUsefulLink:
        getSubmitEventFn(EventCategories.USEFUL_LINKS, EventActions.REMOVE),
      trackAddTodoItem:
        getSubmitEventFn(EventCategories.TODO_ITEMS, EventActions.ADD),
      trackRemoveTodoItem:
        getSubmitEventFn(EventCategories.TODO_ITEMS, EventActions.REMOVE),
      trackTodoItemMarkAsDone:
        getSubmitEventFn(EventCategories.TODO_ITEMS, EventActions.MARK_AS_DONE),
      trackPageBannerNewsUrlClick:
        getSubmitEventFn(EventCategories.PAGE_BANNER, EventActions.CLICK),
      trackNotificationMarkAsRead:
        getSubmitEventFn(EventCategories.SITE_ACTIONS, EventActions.MARK_NOTIFICATION_AS_READ),
      trackUploadBackground:
        getSubmitEventFn(EventCategories.BACKGROUND_IMAGE, EventActions.UPLOAD),
      trackChangeDefaultBackground:
        getSubmitEventFn(EventCategories.BACKGROUND_IMAGE, EventActions.CHOOSE_DEFAULT),
      trackAddAvatar:
        getSubmitEventFn(EventCategories.AVATAR_IMAGE, EventActions.ADD),
      trackRemoveAvatar:
        getSubmitEventFn(EventCategories.AVATAR_IMAGE, EventActions.REMOVE),
      trackSendFeedback:
        getSubmitEventFn(EventCategories.SITE_ACTIONS, EventActions.FEEDBACK),
      trackCalendarSubscribe:
        getSubmitEventFn(EventCategories.SITE_ACTIONS, EventActions.SUBSCRIBE_CALENDAR),
      trackShowWeekFeedTab:
        getSubmitEventFn(EventCategories.SITE_ACTIONS, EventActions.SHOW_WEEK_FEED_TAB),
      trackShowCalendarView:
        getSubmitEventFn(EventCategories.SITE_ACTIONS, EventActions.SHOW_CALENDAR_VIEW),
      trackCalendarLinkClick:
        getSubmitEventFn(EventCategories.WEEK_FEED, EventActions.CLICK),
      trackPageBannerVisibleOnPageLoad:
        getSubmitEventFn(EventCategories.PAGE_BANNER, EventActions.VISIBLE_ON_PAGE_LOAD)
    };
  });
