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

angular.module('directives.dateTimeInput', ['services.language'])

  .constant('DefaultDateTimeFormats', [
    'D.M.YYYY H:mm',
    'D.M.YYYY H.mm',
    'YYYY-M-D H:mm',
    'YYYY-M-D H.mm',
    'D/M/YYYY H:mm',
    'D/M/YYYY H.mm',
    'D.M.YYYY',
    'YYYY-M-D',
    'D/M/YYYY'
  ])

  .directive('dateTimeInput', function (DefaultDateTimeFormats, LanguageService) {
    return {
      restrict: 'A',
      scope: { isStrict: '@dateTimeInputStrict' },
      require: 'ngModel',
      link: function ($scope, elm, attrs, ngModelCtrl) {
        var format;
        if (attrs.dateTimeInput) {
          format = _.map(attrs.dateTimeInput.split(','), function (inputFormat) {
            return _.trim(inputFormat);
          });
        } else {
          format = DefaultDateTimeFormats;
        }

        function getDateTimeFormat() {
          switch (LanguageService.getCurrent()) {
            case 'fi':
              return DefaultDateTimeFormats[0];
            case 'sv':
              return DefaultDateTimeFormats[2];
            case 'en':
              return DefaultDateTimeFormats[4];
            default:
              return DefaultDateTimeFormats[0];
          }
        }

        ngModelCtrl.$formatters.push(function (modelValue) {
          var displayFormat = attrs.dateTimeInput ? format[0] : getDateTimeFormat();

          return modelValue ? moment(modelValue).format(displayFormat) : '';
        });

        ngModelCtrl.$parsers.unshift(function (viewValue) {
          return viewValue ? moment(viewValue, format, !!$scope.isStrict) : '';
        });

        ngModelCtrl.$validators.dateTimeInput = function (modelValue) {
          return ngModelCtrl.$isEmpty(modelValue) || modelValue.isValid();
        };
      }
    };
  });
