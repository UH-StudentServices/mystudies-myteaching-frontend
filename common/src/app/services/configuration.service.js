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

  .constant('RedirectCookie', {
    NAME: 'OO_REDIRECT_TO',
    TIMEOUT_IN_MINUTES: 5
  })

  .constant('Environments', {
    LOCAL: 'local',
    DEV: 'dev',
    QA: 'qa',
    DEMO: 'demo',
    PROD: 'prod'
  })

  .constant('LocalUsers', {
    demo: {
      students: [
        {
          name: 'Venla Jukola',
          username: 'v_jukola',
          subject: 'subjects.foodScience'
        },
        {
          name: 'Juhani Jukola',
          username: 'j_jukola',
          subject: 'subjects.jurisprudence'
        },
        {
          name: 'Kaisa Rajamäki',
          username: 'k_rajama',
          subject: 'subjects.openUniversity'
        }
      ],
      teachers: [
        {
          name: 'Eero Jukola',
          username: 'e_jukola',
          subject: 'faculties.H30'
        },
        {
          name: 'Juhani Jukola',
          username: 'j_jukola',
          subject: 'faculties.H50'
        },
        {
          name: 'Timo Jukola',
          username: 't_jukola',
          subject: 'faculties.A93000'
        }
      ]
    },
    local: {
      students: [
        {
          name: 'Olli Opiskelija',
          username: 'opiskelija',
          subject: 'faculties.H70'
        },
        {
          name: 'Maggie Simpson',
          username: 'mag_simp',
          subject: 'faculties.H70'
        },
        {
          name: 'Hybrid User',
          username: 'hybriduser',
          subject: 'faculties.H50'
        },
        {
          name: 'Test Student',
          username: 'teststudent',
          subject: 'faculties.H70'
        },
        {
          name: 'Test Hybrid User',
          username: 'testhybriduser',
          subject: 'faculties.H10'
        },
        {
          name: 'Test Open Uni Student',
          username: 'testopenunistudent',
          subject: 'faculties.A93000'
        },
        {
          name: 'Test New Student',
          username: 'testnewstudent',
          subject: 'faculties.H70'
        }
      ],
      teachers: [
        {
          name: 'Olli Opettaja',
          username: 'opettaja',
          subject: 'faculties.H30'
        },
        {
          name: 'Hybrid User',
          username: 'hybriduser',
          subject: 'faculties.H50'
        },
        {
          name: 'Test Teacher',
          username: 'testteacher',
          subject: 'faculties.H40'
        },
        {
          name: 'Test Hybrid User',
          username: 'testhybriduser',
          subject: 'faculties.H10'
        }
      ]
    }
  })

  .constant('LocalPassword', 'password')

  .factory('Configuration', function ($window) {
    return $window.configuration ? $window.configuration : {};
  });
