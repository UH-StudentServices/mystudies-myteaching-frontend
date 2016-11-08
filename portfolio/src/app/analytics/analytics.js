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

angular.module('portfolioAnalytics', ['provider.analytics.configuration'])

  .constant('PORTFOLIO_PATH', '/portfolio')
  .constant('TRACK_PAGE_TITLE', 'Portfolio')
  .constant('ANALYTICS_STATE_DIMENSION', 'dimension3')

  .config(function(AnalyticsProvider, AnalyticsConfigurationProvider) {
    AnalyticsProvider.setAccount(AnalyticsConfigurationProvider.getAccounts());
    AnalyticsProvider.trackPages(false);
  })

  .factory('AnalyticsService', function(StateService,
                                        Analytics,
                                        PORTFOLIO_PATH,
                                        TRACK_PAGE_TITLE,
                                        ANALYTICS_STATE_DIMENSION,
                                        $location) {

    var urlWithoutUsername = $location.absUrl().replace(/\/[^\/]+$/, '');

    Analytics.set(ANALYTICS_STATE_DIMENSION, StateService.getCurrent());

    function trackPageView() {
      Analytics.trackPage(PORTFOLIO_PATH, '', {
        location: urlWithoutUsername,
        referer: urlWithoutUsername,
        title: TRACK_PAGE_TITLE});
    }

    return {
      trackPageView: trackPageView
    };
  });
