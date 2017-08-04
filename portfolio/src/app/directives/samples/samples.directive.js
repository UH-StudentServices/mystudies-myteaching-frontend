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

angular.module('directives.samples', [
  'services.samples',
  'services.componentHeadingService',
  'directives.showSamples',
  'directives.editSamples'
])

.directive('samples', function(SamplesService, ComponentHeadingService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      samplesData: '&',
      portfolioId: '@',
      portfolioLang: '@',
      getHeadingOrDefault: '&'
    },
    templateUrl: 'app/directives/samples/samples.html',
    link: function(scope) {
      var HEADING_I18N_KEY = 'samples.title',
          COMPONENT_KEY = 'SAMPLES';

      scope.editing = false;
      scope.samples = scope.samplesData();
      scope.samplesValid = true;

      scope.component = scope.getHeadingOrDefault({componentId: COMPONENT_KEY,
                                                   i18nKey: HEADING_I18N_KEY,
                                                   lang: scope.portfolioLang
      });
      scope.oldTitle = scope.component.heading;

      scope.saveTitle = function() {
        if (scope.component.heading !== scope.oldTitle) {
          ComponentHeadingService.updateHeading(scope.component)
            .then(function(component) {
              if (component.heading) {
                scope.oldTitle = component.heading;
              }
            });
          return true;
        }
        return false;
      };

      scope.edit = function() {
        scope.editing = true;
      };

      var isValid = function() {
        return scope.samples.every(function(sample) {
          return sample.title && sample.url;
        });
      };

      scope.refreshValidity = _.debounce(function() {
        scope.samplesValid = isValid();
      }, 500);

      scope.exitEdit = function() {
        var changed = scope.saveTitle();

        scope.markAllSubmitted();

        if (isValid()) {
          var updateSamples = angular.copy(scope.samples);

          SamplesService.updateSamples(scope.portfolioId, updateSamples).then(function(data) {
            scope.samples = data;
            scope.editing = false;
          });
          changed = true;
        }
        return changed;
      };

      scope.markAllSubmitted = function() {
        scope.samples.forEach(function(sample) { sample.submitted = true; });
      };
    },
  };
});
