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

  .constant('LoginCookie', 'OPINTONI_HAS_LOGGED_IN')

  .constant('Environments', {
    LOCAL: 'local',
    DEV: 'dev',
    QA: 'qa',
    DEMO: 'demo',
    PROD: 'prod',
  })

  .constant('LocalUsers', {
    demo: {
      students: [
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
      teachers: [
        {
          name: 'Eero Jukola',
          username: 'e_jukola'
        },
        {
          name: 'Juhani Jukola',
          username: 'j_jukola'
        }
      ]
    },
    local: {
      students: [
        {
          name: 'Olli Opiskelija',
          username: 'opiskelija'
        },
        {
          name: 'Maggie Simpson',
          username: 'mag_simp'
        },
        {
          name: 'Hybrid User',
          username: 'hybriduser'
        },
        {
          name: 'Test Student',
          username: 'teststudent'
        },
        {
          name: 'Test Hybrid User',
          username: 'testhybriduser'
        },
        {
          name: 'Test Open Uni Student',
          username: 'testopenunistudent'
        }
      ],
      teachers: [
        {
          name: 'Olli Opettaja',
          username: 'opettaja'
        },
        {
          name: 'Hybrid User',
          username: 'hybriduser'
        },
        {
          name: 'Test Teacher',
          username: 'testteacher'
        },
        {
          name: 'Test Hybrid User',
          username: 'testhybriduser'
        }
      ]
    }
  })

  .constant('LocalPassword', 'password')

  .factory('Configuration', function($window) {
    return $window.configuration ? $window.configuration : {};
  });
