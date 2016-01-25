angular.module('services.favorites.rss', ['resources.favorites.rss', 'utils.moment'])

  .factory('RSSService', function(RSSResource, dateArrayToMomentObject) {

    function get(feedUrl, numberOfItems) {

      function convertDate(d) {
        return dateArrayToMomentObject(_.slice(d, 0, 5));
      }

      return RSSResource.get(feedUrl, numberOfItems).then(function(feed) {
        feed.momentDate = convertDate(feed.date);
        _.each(feed.entries, function(entry) {
          entry.momentDate = convertDate(feed.date);
        });
        return feed;
      });
    }

    function getFeedTitle(feedUrl) {
      return RSSResource.get(feedUrl, 1).then(function(feed) {
        return feed.title;
      });
    }

    return {
      get: get,
      getFeedTitle: getFeedTitle
    };

  });
