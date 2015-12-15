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

  //Analytics must be injected at least once if relying on automatic page tracking, do not remove it.
  .run(function(Analytics, SessionService, StateService) {
    SessionService.getFacultyCode().then(function(facultyCode) {
      Analytics.set('dimension1', StateService.getRootStateName());
      Analytics.set('dimension2', facultyCode);
    });
  })

  .config(function(AnalyticsProvider) {
    if (window.configuration) {
      AnalyticsProvider.setAccount(
        {
          tracker: window.configuration.googleAnalyticsAccount,
          trackEvent : true
        });
      AnalyticsProvider.trackPages(true);
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.ignoreFirstPageLoad(true);
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }
  })

  .constant('EventCategories', {
    'FAVORITES' : 'favorites',
    'USEFUL_LINKS' : 'usefulLinks',
    'TODO_ITEMS' : 'todoItems',
    'AVATAR_IMAGE' : 'avatarImage',
    'BACKGROUND_IMAGE' : 'backgroundImage',
    'EXTERNAL_LINK' : 'externalLink',
    'SITE_ACTIONS' : 'siteActions'
  })

  .constant('EventActions', {
    'CLICK' : 'click',
    'ADD' : 'add',
    'REMOVE' : 'remove',
    'CHOOSE_DEFAULT' : 'chooseDefault',
    'UPLOAD' : 'upload',
    'MARK_AS_DONE' : 'markAsDone',
    'SEARCH' : 'search',
    'START_TOUR' : 'startTour',
    'MARK_NOTIFICATION_AS_READ' : 'markNotificationAsRead',
    'FEEDBACK' : 'feedback',
    'SUBSCRIBE_CALENDAR' : 'subscribeCalendar',
    'SHOW_WEEK_FEED_TAB' : 'showWeekFeedTab',
    'SHOW_CALENDAR_VIEW' : 'showCalendarView'
  })

  .constant('EventLabels', {
    'FLAMMA_NEWS' : 'flammaNews'
  })

 .factory('AnalyticsService', function(Analytics, EventCategories, EventActions, EventLabels){

    function trackAddFavorite(favoriteType) {
      Analytics.trackEvent(EventCategories.FAVORITES, EventActions.ADD, favoriteType);
    }

    function trackRemoveFavorite(favoriteType) {
      Analytics.trackEvent(EventCategories.FAVORITES,  EventActions.REMOVE, favoriteType);
    }

    function trackAddUsefulLink() {
      Analytics.trackEvent(EventCategories.USEFUL_LINKS, EventActions.ADD);
    }

    function trackRemoveUsefulLink() {
      Analytics.trackEvent(EventCategories.USEFUL_LINKS, EventActions.REMOVE);
    }

    function trackAddTodoItem() {
      Analytics.trackEvent(EventCategories.TODO_ITEMS, EventActions.ADD);
    }

    function trackRemoveTodoItem() {
      Analytics.trackEvent(EventCategories.TODO_ITEMS, EventActions.REMOVE);
    }

    function trackTodoItemMarkAsDone() {
      Analytics.trackEvent(EventCategories.TODO_ITEMS, EventActions.MARK_AS_DONE);
    }

    function trackFlammaNewsUrlClick() {
      Analytics.trackEvent(EventCategories.EXTERNAL_LINK, EventActions.CLICK, EventLabels.FLAMMA_NEWS);
    }

    function trackSearch() {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.SEARCH);
    }

    function trackStartTour() {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.START_TOUR);
    }

    function trackNotificationMarkAsRead() {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.MARK_NOTIFICATION_AS_READ);
    }

    function trackUploadBackground() {
      Analytics.trackEvent(EventCategories.BACKGROUND_IMAGE, EventActions.UPLOAD);
    }

    function trackChangeDefaultBackground(selectedBackgroundImageName) {
      Analytics.trackEvent(EventCategories.BACKGROUND_IMAGE, EventActions.CHOOSE_DEFAULT, selectedBackgroundImageName);
    }

    function trackAddAvatar(avatarImageSourceMedia) {
      Analytics.trackEvent(EventCategories.AVATAR_IMAGE, EventActions.ADD, avatarImageSourceMedia);
    }

    function trackRemoveAvatar() {
      Analytics.trackEvent(EventCategories.AVATAR_IMAGE, EventActions.REMOVE);
    }

    function trackSendFeedback() {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.FEEDBACK);
    }

    function trackCalendarSubscribe() {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.SUBSCRIBE_CALENDAR);
    }

    function trackShowWeekFeedTab(tab) {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.SHOW_WEEK_FEED_TAB, tab);
    }

    function trackShowCalendarView(view) {
      Analytics.trackEvent(EventCategories.SITE_ACTIONS, EventActions.SHOW_CALENDAR_VIEW, view);
    }


    return {
      trackAddFavorite : trackAddFavorite,
      trackRemoveFavorite : trackRemoveFavorite,
      trackAddUsefulLink : trackAddUsefulLink,
      trackRemoveUsefulLink : trackRemoveUsefulLink,
      trackAddTodoItem : trackAddTodoItem,
      trackRemoveTodoItem : trackRemoveTodoItem,
      trackTodoItemMarkAsDone : trackTodoItemMarkAsDone,
      trackFlammaNewsUrlClick : trackFlammaNewsUrlClick,
      trackSearch : trackSearch,
      trackStartTour : trackStartTour,
      trackNotificationMarkAsRead : trackNotificationMarkAsRead,
      trackUploadBackground : trackUploadBackground,
      trackChangeDefaultBackground : trackChangeDefaultBackground,
      trackAddAvatar : trackAddAvatar,
      trackRemoveAvatar : trackRemoveAvatar,
      trackSendFeedback : trackSendFeedback,
      trackCalendarSubscribe : trackCalendarSubscribe,
      trackShowWeekFeedTab : trackShowWeekFeedTab,
      trackShowCalendarView : trackShowCalendarView
    }
  });

