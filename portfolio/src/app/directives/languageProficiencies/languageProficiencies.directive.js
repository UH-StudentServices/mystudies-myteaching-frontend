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

angular.module('directives.languageProficiencies', ['services.languageProficiencies', 'directives.editableHeading'])
  .directive('languageProficiencies', function(LanguageProficienciesService,
                                               $filter,
                                               $state) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        languageProficienciesData: '&',
        portfolioLang: '@',
        sectionName: '@'
      },
      templateUrl: 'app/directives/languageProficiencies/languageProficiencies.html',
      link: function($scope) {
        var updateBatch,
            orderBy = $filter('orderBy'),
            initUpdateBatch = function() {
              updateBatch = {
                updatedLanguageProficiencies: [],
                newLanguageProficiencies: [],
                deletedIds: []
              };
            },
            newLanguageProficiency = function() {
              return {languageName: '', proficiency: '', description: ''};
            },
            orderByName = function(languageProficiencies) {
              return orderBy(languageProficiencies, 'languageName');
            },
            shouldUpdate = function() {
              return _.some(updateBatch, 'length');
            },
            update = function(languageProficiency) {
              if (languageProficiency.id) {
                updateBatch.updatedLanguageProficiencies = updateBatch.updatedLanguageProficiencies
                  .filter(function(el) {
                    return el.id !== languageProficiency.id;
                  })
                  .concat(languageProficiency);
              }
            };


        _.assign($scope, {
          languageProficiencies: orderByName($scope.languageProficienciesData()),

          edit: function() {
            $scope.editing = true;
            initUpdateBatch();
          },

          exitEdit: function() {
            $scope.$broadcast('saveComponent');

            updateBatch.newLanguageProficiencies = $scope.languageProficiencies
              .filter(function(el) {
                return !el.id;
              });

            if (shouldUpdate()) {
              LanguageProficienciesService.save(updateBatch).then(function(savedProficiencies) {
                $scope.languageProficiencies = orderByName(savedProficiencies);
                $state.reload(); // https://jira.it.helsinki.fi/browse/OO-1004
              });
            }

            $scope.editing = false;

            return true;
          },

          addNew: function() {
            var newEntry = newLanguageProficiency();

            if (newEntry) {
              $scope.languageProficiencies.push(newEntry);
            }
          },

          updateLanguageProficiency: _.debounce(function(languageProficiency) {
            update(languageProficiency);
          }, 300),

          remove: function(languageProficiency) {
            if (languageProficiency.id) {
              updateBatch.deletedIds = _.union(updateBatch.deletedIds, [languageProficiency.id]);
            }

            _.remove($scope.languageProficiencies, function(el) {
              return el.languageName === languageProficiency.languageName;
            });
          }
        });
      }
    };
  });
