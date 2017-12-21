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

angular.module('directives.feedback', [
  'resources.feedback',
  'services.session',
  'services.state'])

  .factory('FeedbackSiteService', function(PortfolioRoleService, PortfolioRole) {
    function getFeedbackSite() {
      var portfolioRole = PortfolioRoleService.getActiveRole();

      switch (portfolioRole) {
        case PortfolioRole.TEACHER:
          return 'academicPortfolio';
        default:
          return 'portfolio';
      }
    }

    return {
      getFeedbackSite: getFeedbackSite
    };
  })

  .directive('feedback', function(FeedbackResource,
                                  SessionService,
                                  FeedbackSiteService,
                                  LanguageService,
                                  $timeout,
                                  $window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/feedback/feedback.html',
      controller: function($scope) {
        var FEEDBACK_DISPLAY_DURATION = 3000;

        function initialState() {
          $scope.showDefaultState = true;
          $scope.showForm = false;
          $scope.showSubmittedState = false;
          $scope.content = '';
          $scope.isAnonymous = false;
        }

        function submittedState() {
          $scope.showSubmittedState = true;
          $scope.showDefaultState = false;
          $scope.showForm = false;
        }

        initialState();

        $scope.giveFeedback = function() {
          $scope.showDefaultState = false;
          $scope.showForm = true;
        };

        $scope.cancel = function() {
          initialState();
        };

        $scope.submit = function() {
          if ($scope.content && $scope.feedbackForm.$valid) {
            SessionService
              .getSession()
              .then(function(session) {
                var facultyCode = session.faculty && session.faculty.code;

                return _.assign({
                  email: session.email
                }, facultyCode ? {
                  facultyCode: facultyCode
                } : {});
              })
              .then(function(sessionData) {
                return {
                  content: $scope.content,
                  email: $scope.isAnonymous ? '' : sessionData.email,
                  metadata: {
                    userAgent: $window.navigator.userAgent,
                    faculty: sessionData.facultyCode,
                    site: FeedbackSiteService.getFeedbackSite(),
                    lang: LanguageService.getCurrent()
                  }
                };
              })
              .then(FeedbackResource.save)
              .then(function() {
                submittedState();
                $timeout(initialState, FEEDBACK_DISPLAY_DURATION);
              });
          }
        };
      }
    };
  });
