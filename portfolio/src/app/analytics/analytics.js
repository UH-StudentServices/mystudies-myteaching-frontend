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

angular.module('portfolioAnalytics', ['provider.analyticsAccounts'])
  .constant('STRIP_USERNAME_REGEX', /\/[^\/]+$/)
  .constant('TRACK_PAGE_TITLE', 'Portfolio')
  .constant('TRACK_PREFIX', '/portfolio')


  .config(function(AnalyticsProvider, ConfigurationProvider, TRACK_PAGE_TITLE, STRIP_USERNAME_REGEX, TRACK_PREFIX) {
    var TRACKER_CONFIG_KEY = 'googleAnalyticsAccountPortfolio';
    var trackerConfig = ConfigurationProvider.$get()[TRACKER_CONFIG_KEY];

    function isStudentPortfolio() {
      return window.location.hostname.indexOf('student') >= 0;
    }

    if (trackerConfig) {
      var config = {
        name: 'PortfolioTracker',
        tracker: trackerConfig,
        trackEvent: true,
        set: {
          anonymizeIp: true,
          // We leave portfolio language out of the location and page attributes of events,
          // as it seems it is not possible to change these attributes for events after configuration.
          location: location.origin + TRACK_PREFIX,
          page: TRACK_PREFIX,
          title: TRACK_PAGE_TITLE
        },
        select: isStudentPortfolio
      };

      AnalyticsProvider.setAccount(config);
      // Disabling automatic page tracking, because it was sending the user name in the title when
      // switching to a portfolio in another language, no matter what I did.
      AnalyticsProvider.trackPages(false);
      AnalyticsProvider.trackPrefix(TRACK_PREFIX);
      AnalyticsProvider.setRemoveRegExp(STRIP_USERNAME_REGEX);
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
      AnalyticsProvider.logAllCalls(true);
    }
  })


  .factory('AnalyticsService', function(Analytics,
                                        STRIP_USERNAME_REGEX,
                                        TRACK_PAGE_TITLE,
                                        TRACK_PREFIX,
                                        $location) {

    function urlWithoutUsername() {
      return $location.absUrl().replace(STRIP_USERNAME_REGEX, '');
    }

    function pathWithoutUsername() {
      return TRACK_PREFIX + $location.url().replace(STRIP_USERNAME_REGEX, '');
    }

    function trackPageParams() {
      return {
        page: pathWithoutUsername(),
        location: urlWithoutUsername(),
        referer: urlWithoutUsername(),
        title: TRACK_PAGE_TITLE
      };
    }


    function trackEventIfAdded(oldArray, newArray, eventCategory, eventAction, label) {
      function filter(arr) {
        return _.reject(arr, function(o) {
          return o == null;
        });
      }
      if (_.difference(filter(newArray), filter(oldArray)).length > 0) {
        trackEvent(eventCategory, eventAction, label);
      }
    }

    function trackEvent(eventCategory, eventAction, label) {
      Analytics.trackEvent(eventCategory, eventAction, label);
    }

    // Automatic page view tracking will leak the user name in the page title to GA, so we track page views manually.
    // In practice only changing portfolio language changes the URL.
    function trackPageView() {
      var params = trackPageParams();

      Analytics.trackPage(params.page, params.title, params);
    }

    var eventCategories =  {
      INTRO_TEXT: 'intro_text',
      BACKGROUND_IMAGE: 'background_image',
      STUDIES: 'studies',
      DEGREES: 'degrees',
      WORK_EXPERIENCE: 'work_experience',
      JOB_SEARCH: 'job_search',
      SAMPLES: 'samples',
      ATTAINMENTS: 'attainments',
      LANGUAGE_PROFICIENCIES: 'language_proficiencies',
      FAVORITES: 'favorites',
      SKILLS_AND_EXPERTISE: 'skills_and_expertise',
      FREE_TEXT_CONTENT: 'free_text_content',
      CONTACT_INFO: 'contact_info',
      PORTFOLIO: 'portfolio'
    };

    var eventActions = {
      SAVE: 'save',
      UPLOAD: 'upload',
      EDIT: 'edit',
      EDIT_HEADING: 'edit_heading',
      ADD_KEYWORD: 'add_keyword',
      ADD: 'add',
      ADD_LINK: 'add_link',
      ADD_IMAGE: 'add_image',
      ADD_FILE: 'add_file',
      EDIT_SUMMARY: 'edit_summary',
      SET_VISIBILITY: 'set_visibility'
    };

    var eventLabels = {
        'VISIBLE': 'visible',
        'HIDDEN': 'hidden'
    };

    return {
      trackEvent: trackEvent,
      trackEventIfAdded: trackEventIfAdded,
      trackPageView: trackPageView,
      ec: eventCategories,
      ea: eventActions,
      el: eventLabels
    };
  });
