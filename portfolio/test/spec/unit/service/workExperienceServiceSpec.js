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

describe('WorkExperienceService', function() {
  var $httpBackend,
      $q,
      $rootScope,
      WorkExperienceService,
      PortfolioService,
      StateService,
      session = {},
      portfolioId = 1,
      apiUrl = '/api/private/v1/portfolio/',
      portfolioRole = 'student',
      portfolioPath = 'olli.opiskelija',
      portfolioResponse = {
        id: portfolioId,
        workExperience: [{employer: 'employer'}],
        jobSearch: {contactEmail: 'olli.opiskelija@helsinki.fi'}
      },
      portfolioApiUrl =  apiUrl + portfolioRole + '/' + portfolioPath;

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

  beforeEach(inject(function(
    _$rootScope_,
    _$q_,
    _$httpBackend_,
    _WorkExperienceService_,
    _StateService_,
    _PortfolioService_) {
    WorkExperienceService = _WorkExperienceService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    PortfolioService = _PortfolioService_;
    StateService = _StateService_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function() {
    session.portfolioPath = {};
    session.portfolioPath[portfolioRole] = portfolioPath;

    StateService.resolveCurrent(
      session,
      portfolioRole,
      portfolioPath);

    PortfolioService.findPortfolioByPath(portfolioRole, portfolioPath);
  });

  beforeEach(function() {
    $httpBackend
      .expect('GET', portfolioApiUrl)
      .respond(portfolioResponse);
  });

  describe('Work experience', function() {

    it('Will provide work experience data', function() {
      getWorkExperienceSubject()
        .subscribe(function(workExperience) {
          expect(workExperience[0].employer)
            .toEqual(portfolioResponse.workExperience[0].employer);
        });

      $httpBackend.flush();
    });
  });

  describe('Job search', function() {

    it('Will provide job search data', function() {
      getJobSearchSubject()
        .subscribe(function(jobSearch) {
          expect(jobSearch.contactEmail)
            .toEqual(portfolioResponse.jobSearch.contactEmail);
        });

      $httpBackend.flush();
    });
  });

  afterEach(verifyRequests);
});