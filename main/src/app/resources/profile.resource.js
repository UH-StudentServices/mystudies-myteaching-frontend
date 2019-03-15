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

angular.module('resources.profile', ['services.state'])

  .factory('ProfileResource', function ($resource) {
    var studentProfileResource = $resource('/api/private/v1/profile/student');
    var teacherProfileResource = $resource('/api/private/v1/profile/teacher');

    function createProfile(resource) {
      return resource.save().$promise;
    }

    function getProfile(resource) {
      return resource.get().$promise;
    }

    return {
      createStudentProfile: _.partial(createProfile, studentProfileResource),
      getStudentProfile: _.partial(getProfile, studentProfileResource),
      createTeacherProfile: _.partial(createProfile, teacherProfileResource),
      getTeacherProfile: _.partial(getProfile, teacherProfileResource)
    };
  });
