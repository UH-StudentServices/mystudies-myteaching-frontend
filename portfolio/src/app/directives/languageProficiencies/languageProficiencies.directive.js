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
  .directive('languageProficiencies', function(AvailablePortfolioLanguages,
                                               AvailableLanguageProficiencies,
                                               LanguageProficienciesService,
                                               $filter) {
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
            translate = $filter('translate'),
            initUpdateBatch = function() {
              updateBatch = {
                updatedLanguageProficiencies: [],
                newLanguageProficiencies: [],
                deletedIds: []
              };
            },
            unusedLanguages = function() {
              return _.difference(AvailablePortfolioLanguages,
                _.map($scope.languageProficiencies, 'language'));
            },
            newLanguageProficiency = function() {
              var unused = unusedLanguages();

              return unused.length ? {language: unused[0], proficiency: 1} : null;
            },
            orderByProficiency = function(languageProficiencies) {
              return orderBy(languageProficiencies, '-proficiency');
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
            },

            NEW_OR_UPDATED_PROP_NAMES = ['updatedLanguageProficiencies',
                                         'newLanguageProficiencies'];


        _.assign($scope, {
          languageProficiencies: orderByProficiency($scope.languageProficienciesData()),
          availableLanguages: AvailablePortfolioLanguages,
          proficiencies: AvailableLanguageProficiencies,

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
                $scope.languageProficiencies = orderByProficiency(savedProficiencies);
              });
            }

            $scope.editing = false;

            return true;
          },

          toggleLanguageSelect: function(scope) {
            if ($scope.editing) {
              scope.proficiencySelectVisible = false;
              scope.languageSelectVisible = !scope.languageSelectVisible;
            }
          },

          toggleProficiencySelect: function(scope) {
            if ($scope.editing) {
              scope.languageSelectVisible = false;
              scope.proficiencySelectVisible = !scope.proficiencySelectVisible;
            }
          },

          translatedLanguageName: function() {
            return function(langCode) {
              return translate('languages.code.' + langCode);
            };
          },

          excludeOtherProficiencyLanguages: function(preselectedLangCode) {
            return function(langCode) {
              return unusedLanguages().concat(preselectedLangCode).indexOf(langCode) !== -1;
            };
          },

          addNew: function() {
            var newEntry = newLanguageProficiency();

            if (newEntry) {
              $scope.languageProficiencies.push(newEntry);
            }
          },

          updateLanguage: function(languageProficiency, language) {
            if (languageProficiency.language !== language) {
              languageProficiency.language = language;
              update(languageProficiency);
            }
          },

          updateProficiency: function(languageProficiency, proficiency) {
            if (languageProficiency.proficiency !== proficiency) {
              languageProficiency.proficiency = proficiency;
              update(languageProficiency);
            }
          },

          remove: function(languageProficiency) {
            if (languageProficiency.id) {
              updateBatch.deletedIds = _.union(updateBatch.deletedIds, [languageProficiency.id]);
            }

            _.remove($scope.languageProficiencies, function(el) {
              return el.language === languageProficiency.language;
            });
          }
        });
      }
    };
  });
