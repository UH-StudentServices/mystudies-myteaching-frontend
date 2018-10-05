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

angular
  .module('directives.favorites.flamma', ['services.favorites', 'services.language'])
  .constant('FLAMMA_EVENTS', {
    fi: 'https://flamma.helsinki.fi/infotaulu/all-events-students-fi.xml',
    en: 'https://flamma.helsinki.fi/infotaulu/all-events-students-en.xml',
    sv: 'https://flamma.helsinki.fi/infotaulu/all-events-students-sv.xml'
  })
  .constant('FLAMMA_NEWS', {
    fi: 'https://flamma.helsinki.fi/infotaulu/atom-news.xml',
    en: 'https://flamma.helsinki.fi/infotaulu/atom-news-en.xml',
    sv: 'https://flamma.helsinki.fi/infotaulu/atom-news-sv.xml'
  })
  .directive('favoritesFlamma', function (FavoritesService, LanguageService, FLAMMA_EVENTS, FLAMMA_NEWS) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/rss/favorites.rss.html',
      replace: true,
      scope: {
        data: '='
      },
      link: function ($scope) {
        var feedUrl;

        switch ($scope.data.type) {
          case 'FLAMMA_EVENTS':
            feedUrl = FLAMMA_EVENTS[LanguageService.getCurrent()];
            break;
          case 'FLAMMA_NEWS':
            feedUrl = FLAMMA_NEWS[LanguageService.getCurrent()];
            break;
          default:
            throw Error('Unknown Flamma type: ' + $scope.data.type);
        }

        FavoritesService.getRSSFeed(feedUrl)
          .then(function getFeedSuccess(feedData) {
            $scope.feedTitle = feedData.title ? feedData.title : feedUrl;
            $scope.feedDateLocalized = feedData.momentDate.format('l');
            $scope.feedLink = feedData.link;
            $scope.feed = feedData;
          });
      }
    };
  });
