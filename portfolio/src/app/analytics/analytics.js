angular.module('portfolioAnalytics', [])

  .constant('PORTFOLIO_PATH', '/portfolio')
  .constant('TRACK_PAGE_TITLE', 'Portfolio')
  .constant('ANALYTICS_STATE_DIMENSION', 'dimension3')

  .config(function(AnalyticsProvider, ConfigurationProvider) {
    var analyticsAccount =  ConfigurationProvider.$get().googleAnalyticsAccount;

    if (analyticsAccount) {
      AnalyticsProvider.setAccount(
        {
          tracker: analyticsAccount,
          trackEvent: true
        });

      AnalyticsProvider.trackPages(false);
    }
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