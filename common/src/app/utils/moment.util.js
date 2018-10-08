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

angular.module('utils.moment', ['services.language'])

  .service('dateArrayToMomentObject', function (LanguageService) {
    function convert(input) {
      if (input && _.isArray(input)) {
        return moment(_.map(input, function (value, index) {
          if (index === 1) {
            // Month is zero indexed
            return value - 1;
          }
          return value;
        })).locale(LanguageService.getCurrent());
        // Temporary workaround for MeCe client overriding global moment locale
      } if (input) {
        return moment(input).locale(LanguageService.getCurrent());
      }

      return undefined;
    }

    return convert;
  })

  .service('momentDateToLocalDateArray', function () {
    return function convert(date) {
      var dateAsArray;
      if (!date) {
        return null;
      }

      dateAsArray = _.take(date.toArray(), 3);
      // Month is zero indexed in moment, API requires months to start from one
      dateAsArray[1] += 1;
      return dateAsArray;
    };
  });
