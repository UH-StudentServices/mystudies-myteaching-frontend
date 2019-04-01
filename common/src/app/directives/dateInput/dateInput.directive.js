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

angular.module('directives.dateInput', ['services.language'])

  .constant('DefaultDateFormats', [
    'D.M.YYYY',
    'YYYY-M-D',
    'D/M/YYYY'
  ])

  .directive('dateInput', function (DefaultDateFormats, LanguageService) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function ($scope, elm, attrs, ngModelCtrl) {
        var format = DefaultDateFormats;
        if (attrs.dateInput) {
          format = attrs.dateInput.split(',').map(function (dateFormat) {
            return _.trim(dateFormat);
          });
        }

        function getDateFormat() {
          switch (LanguageService.getCurrent()) {
            case 'fi':
              return DefaultDateFormats[0];
            case 'sv':
              return DefaultDateFormats[1];
            case 'en':
              return DefaultDateFormats[2];
            default:
              return DefaultDateFormats[0];
          }
        }

        ngModelCtrl.$formatters.push(function (modelValue) {
          var displayFormat = attrs.dateInput ? format[0] : getDateFormat();

          return modelValue ? moment(modelValue).format(displayFormat) : '';
        });

        ngModelCtrl.$parsers.unshift(function (viewValue) {
          return moment(viewValue, format);
        });

        ngModelCtrl.$validators.dateInput = function (modelValue) {
          return ngModelCtrl.$isEmpty(modelValue) || modelValue.isValid();
        };
      }
    };
  });
