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
  var PortfolioService;
  var StateService;
  var session;
  var portfolioId = 1;
  var privateApiBasePath = '/api/private/v1/portfolio/';
  var state = 'private';
  var portfolioRole = 'student';
  var userPath = 'olli-opiskelija';
  var portfolioLang = 'en';
  var portfolioPath = '/' + [portfolioLang, userPath].join('/');

  var portfolioResponse = {
    id: portfolioId,
    workExperience: [{ employer: 'employer' }],
    jobSearch: { contactEmail: 'olli.opiskelija@helsinki.fi' }
  };

  var portfolioApiPath = privateApiBasePath + [portfolioRole, portfolioLang, userPath].join('/');

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

  beforeEach(module('services.portfolioRole', function ($provide) {
    $provide.constant('PortfolioRoleService', { getActiveRole: jasmine.createSpy('PortfolioRoleService.getActiveRole').and.returnValue(portfolioRole) });
  }));

  beforeEach(function () {
    session = { portfolioPathsByRoleAndLang: { student: { en: [portfolioPath] } } };

    inject(function (_$rootScope_, _$q_, _$httpBackend_, _WorkExperienceService_,
      _StateService_, _PortfolioService_) {
      WorkExperienceService = _WorkExperienceService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      PortfolioService = _PortfolioService_;
      StateService = _StateService_;
      $rootScope = _$rootScope_;
    });

    StateService.resolve(
      session,
      portfolioLang,
      userPath
    );

    PortfolioService.findPortfolioByPath(state, portfolioLang, userPath);
  });

  beforeEach(function () {
    $httpBackend
      .expect('GET', portfolioApiPath)
      .respond(portfolioResponse);
  });

  describe('Work experience', function () {
    it('Will provide work experience data', function () {
      getWorkExperienceSubject()
        .subscribe(function (workExperience) {
          expect(workExperience[0].employer)
            .toEqual(portfolioResponse.workExperience[0].employer);
        });

      $httpBackend.flush();
    });
  });

  describe('Job search', function () {
    it('Will provide job search data', function () {
      getJobSearchSubject()
        .subscribe(function (jobSearch) {
          expect(jobSearch.contactEmail)
            .toEqual(portfolioResponse.jobSearch.contactEmail);
        });

      $httpBackend.flush();
    });
  });

  afterEach(verifyRequests);
});
