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

angular.module('directives.weekFeed.feedItem.course',[
])

  .constant('CourseMaterialTranslationKeys', {
    'COURSE_PAGE': 'weekFeed.courseMaterials',
    'MOODLE': 'weekFeed.courseMaterialsMoodle',
    'WIKI': 'weekFeed.courseMaterialsWiki'
  })

  .constant('CourseMaterialTranslationKeysShort', {
    'COURSE_PAGE': 'weekFeed.courseMaterialsShort',
    'MOODLE': 'weekFeed.courseMaterialsMoodleShort',
    'WIKI': 'weekFeed.courseMaterialsWikiShort'
  })


  .directive('course', function($translate) {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/feedItem/course/course.html',
      scope: {
        feedItem: '='
      },
      link: function(scope) {
        var feedItem = scope.feedItem,
            courseCode = feedItem.showAsChild ? '' : feedItem.code,
            courseType = $translate.instant('codes.courseTypes.' + feedItem.typeCode),
            courseCredits = feedItem.credits && !feedItem.showAsChild ?
              feedItem.credits + $translate.instant('abbreviations.credits') :
              '',
            courseTeachers = feedItem.teachers.join(', ');

        scope.courseInfo = [courseCode, courseType, courseCredits, courseTeachers].filter(Boolean).join(', ');
      }
    };
  })

  .directive('courseMaterialsLink', function($filter,
                                             CourseMaterialTranslationKeys,
                                             CourseMaterialTranslationKeysShort) {

    function getTranslationKey(courseMaterialType, compact) {
      var keys = compact ? CourseMaterialTranslationKeysShort : CourseMaterialTranslationKeys;

      return keys[courseMaterialType];
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        compact: '=',
        feedItem: '='
      },
      templateUrl: 'app/directives/weekFeed/feedItem/course/courseMaterialsLink.html',
      link: function($scope) {
        $scope.getCourseMaterialLinkTitle = function(courseMaterialType) {
          return $filter('translate')(getTranslationKey(courseMaterialType, $scope.compact));
        };
      }
    };
  })

  .filter('eventDateSpan', function() {

    function formatMomentDate(momentDate) {
      return momentDate.format('DD.MM.YYYY');
    }

    function formatMomentDateSpan(startDate, endDate) {
      return formatMomentDate(startDate) + ' - ' + formatMomentDate(endDate);
    }

    return function(startDate, endDate) {

      /* Dates are UTC but we want to show them as local times */
      startDate = startDate.local();
      endDate = endDate.local();

      if (startDate.diff(endDate) === 0) {
        return formatMomentDate(startDate);
      } else {
        return formatMomentDateSpan(startDate, endDate);
      }
    };
  });
