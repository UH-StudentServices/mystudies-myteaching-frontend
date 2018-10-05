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

angular.module('directives.editSamples', [])

  .directive('editSamples', function () {
    return {
      restrict: 'E',
      scope: {
        samples: '=',
        onChange: '&'
      },
      templateUrl: 'app/directives/samples/editSamples.html',
      link: function ($scope) {
        $scope.newSample = {};

        $scope.editTitle = function (sample) {
          sample.titleEdit = true;
        };

        $scope.exitTitleEdit = function (sample) {
          sample.titleEdit = false;
        };

        $scope.editUrl = function (sample) {
          sample.urlEdit = true;
        };

        $scope.exitUrlEdit = function (sample) {
          sample.urlEdit = false;
        };

        $scope.editDescription = function (sample) {
          sample.descriptionEdit = true;
        };

        $scope.exitDescriptionEdit = function (sample) {
          sample.descriptionEdit = false;
        };

        $scope.addSample = function (sample) {
          sample.id = Date.now();
          sample.title = '';
          sample.description = '';
          $scope.samples.push(sample);
          $scope.newSample = {};
          $scope.onChange();
        };

        $scope.removeSample = function (sample) {
          $scope.samples = _.without($scope.samples, sample);
          $scope.onChange(); // we might have deleted the only invalid item
        };
      }
    };
  });
