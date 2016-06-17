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

  .constant('primaryLinks', [
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
    }
  ]);
