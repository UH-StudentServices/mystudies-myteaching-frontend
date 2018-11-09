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

angular.module('directives.dateTimeInput', [])

  .directive('dateTimeInput', function () {
    return {
      restrict: 'A',
      scope: { isStrict: '@dateTimeInputStrict' },
      require: 'ngModel',
      link: function ($scope, elm, attrs, ngModelCtrl) {
        var format = _.map(attrs.dateTimeInput.split(','), function (inputFormat) {
          return _.trim(inputFormat);
        }) || 'DD.MM.YYYY HH:mm';

        ngModelCtrl.$formatters.push(function (modelValue) {
          return modelValue ? moment(modelValue).format(format) : '';
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
