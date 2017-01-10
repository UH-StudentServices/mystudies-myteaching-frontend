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

angular.module('constants.externalLinks', [])

.constant('primaryLinks', {
  local: [
    {
      key: 'primaryLinks.oodi',
      href: {
        fi: 'https://weboodi.helsinki.fi/hytest/?Kieli=1&valittuKieli=1',
        sv: 'https://weboodi.helsinki.fi/hytest/?Kieli=2&valittuKieli=2',
        en: 'https://weboodi.helsinki.fi/hytest/?Kieli=6&valittuKieli=6'
      }
    },
    {
      key: 'primaryLinks.courseSearch',
      href: {
        fi: 'https://dev.courses.helsinki.fi/fi/search',
        sv: 'https://dev.courses.helsinki.fi/sv/search',
        en: 'https://dev.courses.helsinki.fi/search'
      }
    },
    {
      key: 'primaryLinks.opinder',
      href: {
        fi: 'https://opinder1.student.helsinki.fi/',
        sv: 'https://opinder1.student.helsinki.fi/',
        en: 'https://opinder1.student.helsinki.fi/'
      }
    }
  ],
  dev: [
    {
      key: 'primaryLinks.oodi',
      href: {
        fi: 'https://weboodi.helsinki.fi/hytest/?Kieli=1&valittuKieli=1',
        sv: 'https://weboodi.helsinki.fi/hytest/?Kieli=2&valittuKieli=2',
        en: 'https://weboodi.helsinki.fi/hytest/?Kieli=6&valittuKieli=6'
      }
    },
    {
      key: 'primaryLinks.courseSearch',
      href: {
        fi: 'https://dev.courses.helsinki.fi/fi/search',
        sv: 'https://dev.courses.helsinki.fi/sv/search',
        en: 'https://dev.courses.helsinki.fi/search'
      }
    },
    {
      key: 'primaryLinks.opinder',
      href: {
        fi: 'https://opinder1.student.helsinki.fi/',
        sv: 'https://opinder1.student.helsinki.fi/',
        en: 'https://opinder1.student.helsinki.fi/'
      }
    }
  ],
  qa: [
    {
      key: 'primaryLinks.oodi',
      href: {
        fi: 'https://weboodi.helsinki.fi/hytest/?Kieli=1&valittuKieli=1',
        sv: 'https://weboodi.helsinki.fi/hytest/?Kieli=2&valittuKieli=2',
        en: 'https://weboodi.helsinki.fi/hytest/?Kieli=6&valittuKieli=6'
      }
    },
    {
      key: 'primaryLinks.courseSearch',
      href: {
        fi: 'https://dev.courses.helsinki.fi/fi/search',
        sv: 'https://dev.courses.helsinki.fi/sv/search',
        en: 'https://dev.courses.helsinki.fi/search'
      }
    },
    {
      key: 'primaryLinks.opinder',
      href: {
        fi: 'https://opinder1.student.helsinki.fi/',
        sv: 'https://opinder1.student.helsinki.fi/',
        en: 'https://opinder1.student.helsinki.fi/'
      }
    }
  ],
  demo: [
    {
      key: 'primaryLinks.oodi',
      href: {
        fi: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=1&valittuKieli=1',
        sv: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=2&valittuKieli=2',
        en: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=6&valittuKieli=6'
      }
    },
    {
      key: 'primaryLinks.courseSearch',
      href: {
        fi: 'https://demo.courses.helsinki.fi/fi/search',
        sv: 'https://demo.courses.helsinki.fi/sv/search',
        en: 'https://demo.courses.helsinki.fi/search'
      }
    }
  ],
  prod: [
    {
      key: 'primaryLinks.oodi',
      href: {
        fi: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=1&valittuKieli=1',
        sv: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=2&valittuKieli=2',
        en: 'https://weboodi.helsinki.fi/hy/frame.jsp?Kieli=6&valittuKieli=6'
      }
    },
    {
      key: 'primaryLinks.courseSearch',
      href: {
        fi: 'https://courses.helsinki.fi/fi/search',
        sv: 'https://courses.helsinki.fi/sv/search',
        en: 'https://courses.helsinki.fi/search'
      }
    },
    {
      key: 'primaryLinks.opinder',
      href: {
        fi: 'https://opinder.helsinki.fi',
        sv: 'https://opinder.helsinki.fi',
        en: 'https://opinder.helsinki.fi'
      }
    }
  ]
});
