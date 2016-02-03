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

angular.module('services.session', [
  'resources.session'
])
  .constant('Role', {
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT',
    ADMIN: 'ADMIN'
  })

  .factory('SessionService', function SessionService($q, SessionResource) {

    var sessionPromise;

    var getSession = function getSession() {
      if (_.isUndefined(sessionPromise)) {
        sessionPromise = SessionResource.getSession();
      }
      return sessionPromise;
    };

    var isInAnyRole = function isInAnyRole(roleNames) {
      return $q
        .all(_.map(roleNames, isInRole))
        .then(_.some);
    };

    var isInRole = function isInRole(roleName) {
      return getSession()
        .then(function(session) {
          return _.invoke(session, 'roles.indexOf', roleName) > -1;
        })
        .catch(function() {
          return false;
        });
    };

    var reloadSession = function getSession() {
      sessionPromise = SessionResource.getSession();
      return sessionPromise;
    };

    var getFacultyCode = function getFacultyCode() {
      return getSession().then(function(session) {
        return session.faculty ? session.faculty.code : undefined;
      });
    };

    return {
      isInRole: isInRole,
      isInAnyRole: isInAnyRole,
      getSession: getSession,
      reloadSession: reloadSession,
      getFacultyCode: getFacultyCode
    };

  });
