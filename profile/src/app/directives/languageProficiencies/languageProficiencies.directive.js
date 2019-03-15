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

angular.module('directives.languageProficiencies', [
  'services.languageProficiencies',
  'services.visibility',
  'directives.editableHeading',
  'profileAnalytics'
])
  .directive('languageProficiencies', function (LanguageProficienciesService,
    $filter,
    $state,
    AnalyticsService,
    Visibility) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        languageProficienciesData: '&',
        profileLang: '@',
        sectionName: '@'
      },
      templateUrl: 'app/directives/languageProficiencies/languageProficiencies.html',
      link: function ($scope) {
        var updateBatch;
        var orderBy = $filter('orderBy');

        var initUpdateBatch = function () {
          updateBatch = {
            updatedLanguageProficiencies: [],
            newLanguageProficiencies: [],
            deletedIds: []
          };
        };

        var newLanguageProficiency = function () {
          return { languageName: '', proficiency: '', description: '', visibility: Visibility.PUBLIC };
        };

        var orderByIndex = function (languageProficiencies) {
          return orderBy(languageProficiencies, 'orderIndex');
        };

        var shouldUpdate = function () {
          return _.some(updateBatch, 'length');
        };

        var update = function (languageProficiency) {
          if (languageProficiency.id) {
            updateBatch.updatedLanguageProficiencies = updateBatch.updatedLanguageProficiencies
              .filter(function (el) {
                return el.id !== languageProficiency.id;
              })
              .concat(languageProficiency);
          }
        };

        _.assign($scope, {
          languageProficiencies: orderByIndex($scope.languageProficienciesData()),
          orderChanged: false,
          sortableOptions: {
            containment: '.language-proficiencies__dropzone',
            orderChanged: function () {
              $scope.orderChanged = true;
            }
          },

          edit: function () {
            $scope.editing = true;
            initUpdateBatch();
          },

          exitEdit: function () {
            $scope.$broadcast('saveComponent');

            if ($scope.orderChanged) {
              $scope.languageProficiencies = $scope.languageProficiencies.map(function (lang, idx) {
                lang.orderIndex = idx + 1;
                return lang;
              });
              updateBatch.updatedLanguageProficiencies = $scope.languageProficiencies
                .filter(function (el) {
                  return el.id;
                });
            }

            updateBatch.newLanguageProficiencies = $scope.languageProficiencies
              .filter(function (el) {
                return !el.id;
              });

            if (updateBatch.newLanguageProficiencies.length > 0) {
              AnalyticsService.trackEvent(
                AnalyticsService.ec.LANGUAGE_PROFICIENCIES,
                AnalyticsService.ea.ADD
              );
            }

            if (shouldUpdate()) {
              LanguageProficienciesService.save(updateBatch).then(function (savedProficiencies) {
                $scope.languageProficiencies = orderByIndex(savedProficiencies);
                $state.reload(); // https://jira.it.helsinki.fi/browse/OO-1004
              });
            }

            $scope.editing = false;

            return true;
          },

          addNew: function () {
            var newEntry = newLanguageProficiency();

            if (newEntry) {
              newEntry.orderIndex = $scope.languageProficiencies.reduce(function (max, lang) {
                return Math.max(max, lang.orderIndex);
              }, 0) + 1;
              $scope.languageProficiencies.push(newEntry);
            }
          },

          updateLanguageProficiency: function (languageProficiency) {
            update(languageProficiency);
          },

          remove: function (languageProficiency) {
            if (languageProficiency.id) {
              updateBatch.deletedIds = _.union(updateBatch.deletedIds, [languageProficiency.id]);
            }

            _.remove($scope.languageProficiencies, function (el) {
              return el.languageName === languageProficiency.languageName;
            });
          }
        });
      }
    };
  });
