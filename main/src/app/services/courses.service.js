
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

angular.module('services.courses', ['resources.courses', 'utils.moment'])

  .factory('CoursesService', function(CoursesResource, dateArrayToUTCMomentObject) {

    var teacherCoursesPromise, studentCoursesPromise;

    function filterUpcomingEnrollments(enrollments) {
      var now = moment();

      return _.filter(enrollments, function(enrollment) {
        return enrollment.startDate.isAfter(now, 'day');
      });
    }

    function convertEnrollmentDates(enrollments) {
      return _.map(enrollments, function(enrollment) {
        enrollment.startDate = dateArrayToUTCMomentObject(enrollment.startDate);
        enrollment.endDate = dateArrayToUTCMomentObject(enrollment.endDate);

        return enrollment;
      });
    }

    function getStudentCoursesPromise() {
      if (!studentCoursesPromise) {
        studentCoursesPromise = CoursesResource.getStudentCourses();
      }

      return studentCoursesPromise;
    }

    function getTeacherCoursesPromise() {
      if (!teacherCoursesPromise) {
        teacherCoursesPromise = CoursesResource.getTeacherCourses();
      }

      return teacherCoursesPromise;
    }

    function getStudentCourses() {
      return getStudentCoursesPromise()
        .then(convertEnrollmentDates);
    }

    function getTeacherCourses() {
      return getTeacherCoursesPromise()
        .then(convertEnrollmentDates);
    }

    function getUpcomingTeacherCourses() {
      return getTeacherCoursesPromise()
        .then(convertEnrollmentDates)
        .then(filterUpcomingEnrollments);
    }

    return {
      getStudentCourses: getStudentCourses,
      getTeacherCourses: getTeacherCourses,
      getUpcomingTeacherCourses: getUpcomingTeacherCourses
    };

  });
