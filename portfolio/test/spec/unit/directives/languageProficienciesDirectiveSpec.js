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

describe('Language proficiencies directive', function() {
  var $compile,
      $scope,
      directiveElem,
      getUpdatedData = _.noop,
      LanguageProficienciesService,
      compileDirective = function() {
        var element = angular.element(
              '<language-proficiencies limit-visibility="[\'STUDENT_ONLY\']"' +
              '                        language-proficiencies-data="portfolio.languageProficiencies">' +
              '</language-proficiencies>'),
            compiledDirective = $compile(element)($scope);

        $scope.$digest();
        return compiledDirective;
      },
      deleteItem = function(el) {
        el.querySelector('.language-proficiency-item__remove').click();
      },
      updateItem = function(el, lang, proficiency) {
        updateLanguage(el, lang);
        updateProficiency(el, proficiency);
      },
      updateLanguage = function(el, lang) {
        var selector = '.language-proficiency-item__select-item-link[translate="languages.code.' +
          lang + '"]';

        el.querySelector('.language-proficiency-item__language-name').click();
        el.querySelector(selector).click();
      },
      updateProficiency = function(el, proficiency) {
        var selector = '.language-proficiency-item__select-item-link[translate="languages.proficiency.' +
          proficiency + '"]';

        el.querySelector('.language-proficiency-item__proficiency').click();
        el.querySelector(selector).click();
      },
      addNewItem = function(lang, proficiency) {
        var itemToAdd;

        directiveElem[0].querySelector('.language-proficiency-list__add-new').click();
        itemToAdd = directiveElem[0].querySelector('.language-proficiency-item[data-id=""]');
        updateItem(itemToAdd, lang, proficiency);
      },
      toggleEditMode = function() {
        directiveElem[0].querySelector('.edit-link-wrapper .edit-link').click();
      },
      hasPreselectedLanguageSelectable = function(els) {
        var preSelectedLanguages = _.map($scope.portfolio.languageProficiencies, 'language');

        return [].slice(els).some(function(el) {
          return preSelectedLanguages.indexOf(el.getAttribute('translate').slice(-2)) !== -1;
        });
      };

  beforeEach(function() {
    module('directives.languageProficiencies', function($provide) {
      $provide.constant('AvailablePortfolioLanguages', ['af', 'ar', 'zh', 'cs', 'da', 'nl', 'en',
                                                        'et', 'fi', 'fr', 'de', 'el', 'hi', 'hu',
                                                        'is', 'it', 'ja', 'ko', 'lv', 'lt', 'no',
                                                        'pl', 'pt', 'ru', 'sk', 'sl', 'es', 'sv',
                                                        'tr']);
      $provide.constant('AvailableLanguageProficiencies', [1, 2, 3, 4, 5]);
      $provide.constant('LanguageProficienciesService', {
        save: jasmine.createSpy('LanguageProficienciesService.save').and.returnValue({
          then: function(handler) {
            handler(getUpdatedData());
          }
        })
      });
      $provide.constant('translateFilter', function(val) {return val;});
    });

    module('templates');
    module('directives.editLink');
    module('directives.onEnterOrClick');

    inject(function(_$compile_, _$rootScope_, _LanguageProficienciesService_) {
      $compile = _$compile_;
      LanguageProficienciesService = _LanguageProficienciesService_;
      $scope = _$rootScope_.$new();

      $scope.portfolio = {
        languageProficiencies: [{
          id: 1,
          language: 'en',
          proficiency: 4
        }, {
          id: 2,
          language: 'sv',
          proficiency: 1
        }, {
          id: 3,
          language: 'fi',
          proficiency: 5
        }]
      };

      directiveElem = compileDirective();
    });

    getUpdatedData = _.noop;
  });

  it('should render language proficiency items passed in by parent scope', function() {
    var items = directiveElem[0].querySelectorAll('.language-proficiency-item');

    expect(items.length).toEqual(3);
  });

  it('should send update diff after adding, modifying and deleting language proficiency items', function() {
    var itemToDelete, itemToUpdate;

    toggleEditMode();

    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id="1"]');
    deleteItem(itemToDelete);

    itemToUpdate = directiveElem[0].querySelector('.language-proficiency-item[data-id="2"]');
    updateItem(itemToUpdate, 'zh', 2);

    addNewItem('nl', 4);
    toggleEditMode();

    expect(LanguageProficienciesService.save).toHaveBeenCalledWith({
      updatedLanguageProficiencies: [{id: 2, language: 'zh', proficiency: 2}],
      newLanguageProficiencies: [{language: 'nl', proficiency: 4}],
      deletedIds: [1]
    });
  });

  it('should not send update diff when post-edit state is unchanged from initial state', function() {
    var itemToDelete;

    toggleEditMode();

    addNewItem('nl', 4);

    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id=""]');
    deleteItem(itemToDelete);

    toggleEditMode();

    expect(LanguageProficienciesService.save.calls.any()).toEqual(false);
  });

  it('should not permit selection of languages that are already saved as language proficiencies', function() {
    var langs,
        selectableLanguagesSelector =
          '.language-proficiency-item[data-id=""] .language-proficiency-item__select-item-link';

    toggleEditMode();

    directiveElem[0].querySelector('.language-proficiency-list__add-new').click();
    langs = directiveElem[0].querySelector(selectableLanguagesSelector);

    expect(hasPreselectedLanguageSelectable(langs)).toBe(false);
  });

  it('should only send new updates recorded after previous closing of edit mode', function() {
    var itemToDelete;

    getUpdatedData = function() {
      return [{
        id: 1,
        language: 'en',
        proficiency: 4
      }, {
        id: 3,
        language: 'fi',
        proficiency: 5
      }, {
        id: 4,
        language: 'fr',
        proficiency: 2
      }];
    };

    toggleEditMode();

    addNewItem('fr', 2);

    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id="2"]');
    deleteItem(itemToDelete);

    toggleEditMode();
    $scope.$digest();
    toggleEditMode();

    addNewItem('de', 5);

    toggleEditMode();

    expect(LanguageProficienciesService.save.calls.count()).toEqual(2);
    expect(LanguageProficienciesService.save.calls.mostRecent().args[0]).toEqual({
      updatedLanguageProficiencies: [],
      newLanguageProficiencies: [{language: 'de', proficiency: 5}],
      deletedIds: []
    });
  });
});
