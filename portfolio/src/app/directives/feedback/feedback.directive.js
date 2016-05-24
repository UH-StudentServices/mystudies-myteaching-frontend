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

  .directive('feedback', function(FeedbackResource, SessionService, PortfolioRoleService,
                                  $timeout, $window) {
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
          $scope.emailReply = false;
          $scope.email = undefined;
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
                return _.get(session, 'faculty.code');
              })
              .then(function(faculty) {
                return {
                  content: $scope.content,
                  email: $scope.email,
                  metadata: {
                    userAgent: $window.navigator.userAgent,
                    faculty: faculty,
                    state: 'portfolio',
                    role: PortfolioRoleService.getPortfolioRoleFromDomain()
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
