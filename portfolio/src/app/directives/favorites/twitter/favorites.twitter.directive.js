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

angular.module('directives.favorites.twitter', [])

  .directive('favoritesTwitter', function($window) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/favorites/twitter/favorites.twitter.html',
      replace: true,
      scope: {
        data: '='
      },
      link: function(scope, el) {
        var TWITTER_SCRIPT_ID = 'twitter-wjs',
            TWITTER_WIDGETS_URL = 'https://platform.twitter.com/widgets.js';

        scope.$watch('favorites.length', function() {
          if ($window.twttr) {
            twttr.widgets.createTimeline(
              {
                sourceType: 'profile',
                screenName: scope.data.value
              },
              el[0]
            );
          }
        });

        if (!document.getElementById(TWITTER_SCRIPT_ID)) {
          var twitterScript = document.createElement('script'),
              firstScript = document.getElementsByTagName('script')[0];

          twitterScript.id = TWITTER_SCRIPT_ID;
          twitterScript.src = TWITTER_WIDGETS_URL;
          firstScript.parentNode.insertBefore(twitterScript, firstScript);
        }
      }
    };
  });
