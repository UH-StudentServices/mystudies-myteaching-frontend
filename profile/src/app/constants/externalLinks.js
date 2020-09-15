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

angular.module('constants.externalLinks', [])

  .constant('primaryLinks', [{ key: 'navigationTab.list', href: '', active: true }])

  .constant('pageFooterLinks', [
    {
      key: 'pageFooterLinks.contact',
      href: {
        fi: 'https://www.helsinki.fi/fi/yliopisto/henkilohaku',
        sv: 'https://www.helsinki.fi/sv/universitetet/personsokning',
        en: 'https://www.helsinki.fi/en/university/people-finder'
      }
    },
    {
      key: 'pageFooterLinks.library',
      href: {
        fi: 'http://www.helsinki.fi/kirjasto',
        sv: 'http://www.helsinki.fi/kirjasto/sv',
        en: 'http://www.helsinki.fi/kirjasto/en'
      }
    },
    {
      key: 'pageFooterLinks.flamma',
      href: {
        fi: 'https://flamma.helsinki.fi/',
        sv: 'https://flamma.helsinki.fi/sv',
        en: 'https://flamma.helsinki.fi/en'
      }
    }
  ]);
