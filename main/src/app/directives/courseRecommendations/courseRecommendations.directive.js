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

angular.module('directives.courseBrowsingRecommendations', [
  'resources.courseRecommendations',
  'opintoniAnalytics'
])

  .constant('RECOMMENDATIONS_BROWSING_LOADER_KEY', 'browsing_recommendations')
  .constant('RECOMMENDATIONS_DEFAULT_AMOUNT', 5)
  .constant('RECOMMENDATIONS_MAX_AMOUNT', 20)

  .directive('courseBrowsingRecommendations', function($window, Loader, RECOMMENDATIONS_BROWSING_LOADER_KEY) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/courseRecommendations/courseBrowsingRecommendations.html',
      scope: {},
      link: function(scope, el) {
        var LEIKI_SCRIPT_ID = 'leiki-loader-script',
            LEIKI_WIDGET_URL = '//suositukset.student.helsinki.fi/focus/widgets/loader/loader-min.js?t=';

        $window._leikiw = $window._leikiw || [];
        $window._leikiw.push({
          name: 'kurssi2',
          server: '//suositukset.student.helsinki.fi/focus',
          referer: 'https://student.helsinki.fi/opintoni',
          cid: ' https://student.helsinki.fi/opintoni',
          isJson: true,
          jsonCallback: function(data) {
            Loader.stop(RECOMMENDATIONS_BROWSING_LOADER_KEY);
            // TODO: Cut away the last part in the actualUrl and get better name/headline
            scope.courseRecommendations = data.tabs[0].items;
            scope.$apply();
          }
        });

        scope.trackRecommendationLinkClick = function(courseName) {
          console.log('anal ' + courseName);
          //AnalyticsService.trackCourseRecommendationLinkClick(courseName);
        };

        Loader.start(RECOMMENDATIONS_BROWSING_LOADER_KEY);

        if (!document.getElementById(LEIKI_SCRIPT_ID)) {
          var t = new Date().getTime(),
              leikiScript = document.createElement('script'),
              firstScript = document.getElementsByTagName('script')[0];

          t -= t % (1000 * 60 * 60 * 24 * 30);

          leikiScript.id = LEIKI_SCRIPT_ID;
          leikiScript.type = 'text/javascript';
          leikiScript.async = true;
          leikiScript.src = LEIKI_WIDGET_URL + t;

          firstScript.parentNode.insertBefore(leikiScript, firstScript);
        }
      }
    };
  });

angular.module('directives.courseStudiesRecommendations', [
  'resources.courseRecommendations',
  'opintoniAnalytics'
])

  .constant('RECOMMENDATIONS_STUDIES_LOADER_KEY', 'studies_recommendations')
  .constant('RECOMMENDATIONS_DEFAULT_AMOUNT', 5)
  .constant('RECOMMENDATIONS_MAX_AMOUNT', 20)

  .directive('courseStudiesRecommendations', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/courseRecommendations/courseStudiesRecommendations.html',
      scope: {},
      controller: function($scope,
                           CourseRecommendationsResource,
                           Loader,
                           RECOMMENDATIONS_STUDIES_LOADER_KEY,
                           RECOMMENDATIONS_DEFAULT_AMOUNT,
                           RECOMMENDATIONS_MAX_AMOUNT,
                           AnalyticsService) {

        $scope.trackRecommendationLinkClick = function(courseName) {
          AnalyticsService.trackCourseRecommendationLinkClick(courseName);
        };

        $scope.limit = RECOMMENDATIONS_DEFAULT_AMOUNT;

        $scope.showMore = function() {
          $scope.limit = RECOMMENDATIONS_MAX_AMOUNT;
        };

        $scope.showLess = function() {
          $scope.limit = RECOMMENDATIONS_DEFAULT_AMOUNT;
        };

        Loader.start(RECOMMENDATIONS_STUDIES_LOADER_KEY);

        CourseRecommendationsResource.getCourseRecommendations()
          .then(function(courseRecommendations) {
            $scope.courseRecommendations = courseRecommendations;
          })
          .finally(function() {
            Loader.stop(RECOMMENDATIONS_STUDIES_LOADER_KEY);
          });
      }
    };
  });
