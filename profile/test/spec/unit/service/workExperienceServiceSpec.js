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

describe('WorkExperienceService', function () {
  var $httpBackend;
  var $q; // eslint-disable-line no-unused-vars
  var $rootScope; // eslint-disable-line no-unused-vars
  var WorkExperienceService;
  var ProfileService;
  var StateService;
  var session;
  var profileId = 1;
  var privateApiBasePath = '/api/private/v1/profile/';
  var state = 'private';
  var profileRole = 'student';
  var userPath = 'olli-opiskelija';
  var profileLang = 'en';
  var profilePath = '/' + [profileLang, userPath].join('/');
  var profileResponse = {
    id: profileId,
    workExperience: [{ employer: 'employer' }],
    jobSearch: { contactEmail: 'olli.opiskelija@helsinki.fi' }
  };
  var profileApiPath = privateApiBasePath + [profileRole, profileLang, userPath].join('/');

  function filterEmpty(value) {
    return value;
  }

  function getWorkExperienceSubject() {
    return WorkExperienceService
      .getWorkExperienceSubject()
      .filter(filterEmpty);
  }

  function getJobSearchSubject() {
    return WorkExperienceService
      .getJobSearchSubject()
      .filter(filterEmpty);
  }

  function verifyRequests() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }

  beforeEach(module('ngResource'));
  beforeEach(module('utils.moment'));
  beforeEach(module('services.workExperience'));
  beforeEach(module('services.profileRole', function ($provide) {
    $provide.constant('ProfileRoleService', { getActiveRole: jasmine.createSpy('ProfileRoleService.getActiveRole').and.returnValue(profileRole) });
  }));
  beforeEach(function () {
    session = { profilePathsByRoleAndLang: { student: { en: [profilePath] } } };

    inject(function (_$rootScope_, _$q_, _$httpBackend_, _WorkExperienceService_,
      _StateService_, _ProfileService_) {
      WorkExperienceService = _WorkExperienceService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      ProfileService = _ProfileService_;
      StateService = _StateService_;
      $rootScope = _$rootScope_;
    });

    StateService.resolve(
      session,
      profileLang,
      userPath
    );

    ProfileService.findProfileByPath(state, profileLang, userPath);
  });
  beforeEach(function () {
    $httpBackend
      .expect('GET', profileApiPath)
      .respond(profileResponse);
  });

  describe('Work experience', function () {
    it('Will provide work experience data', function () {
      getWorkExperienceSubject()
        .subscribe(function (workExperience) {
          expect(workExperience[0].employer)
            .toEqual(profileResponse.workExperience[0].employer);
        });

      $httpBackend.flush();
    });
  });

  describe('Job search', function () {
    it('Will provide job search data', function () {
      getJobSearchSubject()
        .subscribe(function (jobSearch) {
          expect(jobSearch.contactEmail)
            .toEqual(profileResponse.jobSearch.contactEmail);
        });

      $httpBackend.flush();
    });
  });

  afterEach(verifyRequests);
});
