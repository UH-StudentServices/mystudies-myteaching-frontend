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

  .directive('feedback', function(FeedbackResource, $timeout, $window, SessionService,
                                  StateService, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/feedback/feedback.html',
      controller: function($scope) {
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
          if (!_.isEmpty($scope.content) && $scope.feedbackForm.$valid) {
            SessionService
              .getSession()
              .then(function(session) {
                return {
                  facultyCode: session.faculty.code,
                  email: session.email
                };
              })
              .then(function(sessionData) {
                return {
                  content: $scope.content,
                  email: $scope.isAnonymous ? '' : sessionData.email,
                  metadata: {
                    userAgent: $window.navigator.userAgent,
                    faculty: sessionData.facultyCode,
                    state: StateService.getRootStateName()
                  }
                };
              })
              .then(FeedbackResource.save)
              .then(function() {
                AnalyticsService.trackSendFeedback();
                submittedState();
                $timeout(initialState, 3000);
              });
          }
        };
      }
    };
  });
