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

'use strict';

angular.module('directives.weekFeed.feedItem.course', [
  'services.language',
  'directives.helpIcon',
  'directives.analytics'
])

  .constant('CourseMaterialTranslationKeys', {
    COURSE_PAGE: 'weekFeed.courseMaterials',
    MOODLE: 'weekFeed.courseMaterialsMoodle',
    WIKI: 'weekFeed.courseMaterialsWiki'
  })

  .constant('CourseMaterialTranslationKeysShort', {
    COURSE_PAGE: 'weekFeed.courseMaterialsShort',
    MOODLE: 'weekFeed.courseMaterialsMoodleShort',
    WIKI: 'weekFeed.courseMaterialsWikiShort'
  })

  .constant('CourseMaterialTypes', {
    COURSE_PAGE: 'COURSE_PAGE',
    MOODLE: 'MOODLE',
    WIKI: 'WIKI'
  })

  .constant('TeacherRoles', { OFFICIAL: 'official' })

  .directive('course', function ($translate, TeacherRoles) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/weekFeed/feedItem/course/course.html',
      scope: { feedItem: '=' },
      link: function (scope) {
        var feedItem = scope.feedItem;
        var courseCode = feedItem.showAsChild ? '' : feedItem.code;
        var courseType = $translate.instant('codes.courseTypes.' + feedItem.typeCode);
        var courseCredits = feedItem.credits && !feedItem.showAsChild
          ? '(' + feedItem.credits + $translate.instant('abbreviations.credits') + ')'
          : '';
        var courseTeachers = feedItem.teachers.join(', ');

        scope.courseInfo = [courseCode, courseType + ' ' + courseCredits, courseTeachers]
          .filter(Boolean)
          .join(', ');

        scope.isOfficial = function (item) {
          return item.teacherRole === TeacherRoles.OFFICIAL;
        };
      }
    };
  })

  .directive('courseMaterialsLink', function ($filter,
    CourseMaterialTranslationKeys,
    CourseMaterialTranslationKeysShort,
    CourseMaterialTypes) {
    function getTranslationKey(courseMaterialType, compact) {
      var keys = compact ? CourseMaterialTranslationKeysShort : CourseMaterialTranslationKeys;

      return keys[courseMaterialType];
    }

    function getCourseMaterialLinkTitle(courseMaterialType, isCompact) {
      return $filter('translate')(getTranslationKey(courseMaterialType, isCompact));
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        compact: '=',
        feedItem: '='
      },
      templateUrl: 'app/directives/weekFeed/feedItem/course/courseMaterialsLink.html',
      link: function ($scope) {
        if ($scope.feedItem.courseMaterial) {
          $scope.courseMaterialType = $scope.feedItem.courseMaterial.courseMaterialType;
          $scope.courseMaterialLinkTitle =
            getCourseMaterialLinkTitle($scope.courseMaterialType, $scope.compact);
        }

        $scope.isMoodleAndNotCompact = function () {
          return $scope.courseMaterialType === CourseMaterialTypes.MOODLE && !$scope.compact;
        };
      }
    };
  })

  .filter('eventDateSpan', function (LanguageService) {
    var locale = LanguageService.getLocale();
    var dateFormat = 'l';

    function formatMomentDate(momentDate) {
      if (momentDate) {
        return momentDate.locale(locale).format(dateFormat);
      }
      return undefined;
    }

    return function (startDate, endDate) {
      var formattedStartDate = formatMomentDate(startDate);
      var formattedEndDate = formatMomentDate(endDate);

      if (formattedStartDate && formattedEndDate && formattedStartDate !== formattedEndDate) {
        return formattedStartDate + ' - ' + formattedEndDate;
      }
      return formattedStartDate;
    };
  });
