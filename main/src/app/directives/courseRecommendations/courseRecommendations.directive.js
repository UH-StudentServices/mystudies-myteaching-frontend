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
  'resources.courses',
  'opintoniAnalytics',
  'services.scriptInjector'
])

  .constant('RECOMMENDATIONS_BROWSING_LOADER_KEY', 'browsing_recommendations')
  .constant('RECOMMENDATIONS_DEFAULT_AMOUNT', 5)
  .constant('RECOMMENDATIONS_MAX_AMOUNT', 20)

  .directive('courseBrowsingRecommendations', function($window,
                                                       Loader,
                                                       CoursesResource,
                                                       RECOMMENDATIONS_BROWSING_LOADER_KEY,
                                                       AnalyticsService,
                                                       ScriptInjectorService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/courseRecommendations/courseBrowsingRecommendations.html',
      scope: {},
      link: function(scope, el) {
        var LEIKI_SCRIPT_ID = 'leiki-loader-script',
            LEIKI_WIDGET_URL = '//suositukset.student.helsinki.fi/focus/widgets/loader/loader-min.js?t=',
            t = new Date().getTime();

        $window._leikiw = $window._leikiw || [];
        $window._leikiw.push({
          name: 'kurssi2',
          server: '//suositukset.student.helsinki.fi/focus',
          referer: 'https://student.helsinki.fi/opintoni',
          cid: ' https://student.helsinki.fi/opintoni',
          isJson: true,
          jsonCallback: function(data) {
            if (data.tabs && data.tabs[0].items) {
              var items = data.tabs[0].items.map(function(leikiItem) {
                var actualUrlArray = leikiItem.actualUrl.split('/');

                return actualUrlArray[actualUrlArray.length - 2];
              }).join();

              CoursesResource.getCourseNames(items)
                .then(function(courseNames) {
                  Loader.stop(RECOMMENDATIONS_BROWSING_LOADER_KEY);
                  scope.courseRecommendations = courseNames;
                });
            }
          }
        });

        scope.trackRecommendationLinkClick = function(courseName) {
          AnalyticsService.trackCourseRecommendationLinkBrowsingClick(courseName);
        };

        Loader.start(RECOMMENDATIONS_BROWSING_LOADER_KEY);
        ScriptInjectorService.addScript(LEIKI_SCRIPT_ID, LEIKI_WIDGET_URL + t);
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
