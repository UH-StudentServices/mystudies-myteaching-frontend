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

describe('Language proficiencies directive', function () {
  var $compile;
  var $scope;
  var $state;
  var directiveElem;
  var getUpdatedData = _.noop;
  var LanguageProficienciesService;

  var compileDirective = function () {
    var element = angular.element(
      '<language-proficiencies limit-visibility="[\'STUDENT_ONLY\']"'
              + '                        language-proficiencies-data="profile.languageProficiencies"'
              + '                        profile-lang="en">'
              + '</language-proficiencies>'
    );

    var compiledDirective = $compile(element)($scope);

    $scope.$digest();
    return compiledDirective;
  };

  var deleteItem = function (el, profiencyMatcher) {
    el.querySelector('.language-proficiency-item__remove').click();
    directiveElem.isolateScope().remove(profiencyMatcher);
  };

  var updateLanguage = function (el, lang) {
    var inputElement = el.querySelector('.language-proficiency-item__language-name input');

    inputElement.value = lang;
  };

  var updateProficiency = function (el, proficiency) {
    var inputElement = el.querySelector('.language-proficiency-item__proficiency input');

    inputElement.value = proficiency;
  };

  var updateDescription = function (el, description) {
    var inputElement = el.querySelector('.language-proficiency-item__description textarea');

    inputElement.value = description;
  };

  var updateItem = function (el, lang, proficiency) {
    updateLanguage(el, lang);
    updateProficiency(el, proficiency);
    updateDescription(el, 'description');
    directiveElem.isolateScope().updateLanguageProficiency({
      id: Number(el.getAttribute('data-id')) || null,
      languageName: lang,
      proficiency: proficiency,
      description: 'description'
    });
  };

  var addNewItem = function (lang, proficiency) {
    var itemToAdd;

    directiveElem[0].querySelector('.language-proficiency-list__add-new').click();
    itemToAdd = directiveElem[0].querySelector('.language-proficiency-item[data-id=""]');
    updateItem(itemToAdd, lang, proficiency);
    directiveElem.isolateScope().languageProficiencies.pop();
    directiveElem.isolateScope().languageProficiencies.push({
      languageName: lang,
      proficiency: proficiency,
      description: 'description'
    });
  };

  var toggleEditMode = function () {
    directiveElem[0].querySelector('.component-header .edit-link').click();
  };

  angular.module('profileAnalytics', []);

  beforeEach(function () {
    module('directives.languageProficiencies', function ($provide) {
      $provide.constant('LanguageProficienciesService', {
        save: jasmine.createSpy('LanguageProficienciesService.save').and.returnValue({
          then: function (handler) {
            handler(getUpdatedData());
          }
        })
      });
      $provide.constant('translateFilter', function (val) { return val; });
      $provide.constant('$translate', function (val) { return { then: function () { return val; } }; });
      $provide.constant('ProfileService', { getProfile: function () { return { then: function () { return { headings: [] }; } }; } });
      $provide.constant('ComponentHeadingService', function (val) { return val; });
      $provide.constant('$state', { reload: jasmine.createSpy('$state.reload') });
      $provide.constant('AnalyticsService', {
        trackEvent: function () {},
        ec: {},
        ea: {}
      });
    });

    module('templates');
    module('directives.editLink');

    inject(function (_$compile_, _$rootScope_, _LanguageProficienciesService_, _$state_) {
      $compile = _$compile_;
      LanguageProficienciesService = _LanguageProficienciesService_;
      $scope = _$rootScope_.$new();
      $state = _$state_;

      $scope.profile = {
        languageProficiencies: [
          {
            id: 1,
            languageName: 'en',
            proficiency: 'Excellent',
            description: 'description'
          }, {
            id: 2,
            languageName: 'sv',
            proficiency: 'Basic',
            description: 'description'
          }, {
            id: 3,
            languageName: 'fi',
            proficiency: 'Native',
            description: 'description'
          }
        ]
      };

      directiveElem = compileDirective();
    });

    getUpdatedData = _.noop;
  });

  it('should render language proficiency items passed in by parent scope', function () {
    var items = directiveElem[0].querySelectorAll('.language-proficiency-item');

    expect(items.length).toEqual(3);
  });

  it('should send update diff after adding, modifying and deleting language proficiency items', function () {
    var itemToDelete; var
      itemToUpdate;

    toggleEditMode();
    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id="1"]');
    deleteItem(itemToDelete, { id: 1 });

    itemToUpdate = directiveElem[0].querySelector('.language-proficiency-item[data-id="2"]');
    updateItem(itemToUpdate, 'zh', 'Moderate');

    addNewItem('nl', 'Excellent');
    toggleEditMode();
    expect(LanguageProficienciesService.save).toHaveBeenCalledWith({
      updatedLanguageProficiencies: [{ id: 2, languageName: 'zh', proficiency: 'Moderate', description: 'description' }],
      newLanguageProficiencies: [{ languageName: 'nl', proficiency: 'Excellent', description: 'description' }],
      deletedIds: [1]
    });

    expect($state.reload).toHaveBeenCalledTimes(1);
  });

  it('should not send update diff when post-edit state is unchanged from initial state', function () {
    var itemToDelete;

    toggleEditMode();

    addNewItem('nl', 'Excellent');

    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id=""]');
    deleteItem(itemToDelete, { languageName: 'nl' });

    toggleEditMode();
    expect(LanguageProficienciesService.save.calls.any()).toEqual(false);
  });

  it('should only send new updates recorded after previous closing of edit mode', function () {
    var itemToDelete;

    getUpdatedData = function () {
      return [
        {
          id: 1,
          languageName: 'en',
          proficiency: 'Excellent',
          description: 'description'
        }, {
          id: 3,
          languageName: 'fi',
          proficiency: 'Native',
          description: 'description'
        }, {
          id: 4,
          languageName: 'fr',
          proficiency: 'Moderate',
          description: 'description'
        }
      ];
    };

    toggleEditMode();

    addNewItem('fr', 'Moderate');

    itemToDelete = directiveElem[0].querySelector('.language-proficiency-item[data-id="2"]');
    deleteItem(itemToDelete, { id: 2 });

    toggleEditMode();
    $scope.$digest();
    toggleEditMode();

    addNewItem('de', 'Native');

    toggleEditMode();

    expect(LanguageProficienciesService.save.calls.count()).toEqual(2);
    expect(LanguageProficienciesService.save.calls.mostRecent().args[0]).toEqual({
      updatedLanguageProficiencies: [],
      newLanguageProficiencies: [{ languageName: 'de', proficiency: 'Native', description: 'description' }],
      deletedIds: []
    });
  });
});
