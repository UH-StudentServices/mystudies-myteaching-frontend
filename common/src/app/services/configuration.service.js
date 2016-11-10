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

angular.module('services.configuration', [])

  .constant('ConfigurationProperties', {
    STUDENT_APP_URL: 'studentAppUrl',
    TEACHER_APP_URL: 'teacherAppUrl'
  })

  .constant('Environments', {
    LOCAL: 'local',
    DEV: 'dev',
    QA: 'qa',
    DEMO: 'demo',
    PROD: 'prod',
  })

  .constant('DemoUsers', {
    STUDENTS: [
      {
        name: 'Venla Jukola',
        username: 'v_jukola'
      },
      {
        name: 'Juhani Jukola',
        username: 'j_jukola'
      },
      {
        name: 'Kaisa Rajamäki',
        username: 'k_rajama'
      }
    ],
    TEACHERS: [
      {
        name: 'Eero Jukola',
        username: 'e_jukola'
      },
      {
        name: 'Juhani Jukola',
        username: 'j_jukola'
      }
    ]
  })

  .constant('DemoEnvPassword', 'password')

  .factory('Configuration', function($window) {
    return $window.configuration ? $window.configuration : {};
  });
