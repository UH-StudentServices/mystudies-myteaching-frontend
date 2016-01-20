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

'use strict';

angular.module('directives.admin.feedback', [
  'resources.feedback'])

  .filter('faculty', function($filter) {
    return function(metadata) {
      var metadataJSON = JSON.parse(metadata);
      var facultyCode = metadataJSON.faculty;
      if(facultyCode) {
        return $filter('translate')('faculties.' + facultyCode);
      } else {
        return "";
      }
    }
  })

  .filter('userAgent', function() {
    return function(metadata) {
      var metadataJSON = JSON.parse(metadata);
      return metadataJSON.userAgent;
    }
  })

  .filter('state', function($filter) {
    return function(metadata) {
      var metadataJSON = JSON.parse(metadata);
      var state = metadataJSON.state;
      if(state) {
        return $filter('translate')(state + '.pageHeaderBranding');
      } else {
        return "";
      }
    }
  })

  .directive('adminFeedback', function($timeout, FeedbackResource) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/admin/feedback/feedback.html',
      link: function($scope) {
        var REMOVE_FEEDBACK_DELAY = 300,
            TEMP_MODEL_PROPS_LIST = ['commentEditMode', 'stagedComment', 'inflightUpdate'],
            itemsPerPage = 5,
            loadingFeedback = [],
            allItems,
            focusCommentInput = function(index) {
              angular.isNumber(index) && _.defer(function() {
                angular.element('.feedback-comment-edit-controls__comment-content').eq(index)[0].focus();
              });
            },
            stripTempModelProps = function(feedback) {
              return _.omit(feedback, TEMP_MODEL_PROPS_LIST);
            },
            updateFeedback = function(feedback) {
              return FeedbackResource.update(stripTempModelProps(feedback));
            },
            stopLoading = function(feedback) {
              $timeout(function (){
                _.remove(loadingFeedback, function(item) {
                  return item.id === feedback.id;
                });
              }, REMOVE_FEEDBACK_DELAY);
            };

        $scope.activePage = 0;
        $scope.pageIndexes = [];

        FeedbackResource.getFeedback().then(function getFeedbackSuccess(feedback) {
          allItems = feedback.reverse();
          for(var i=0; i<Math.ceil(allItems.length / itemsPerPage); i++) {
            $scope.pageIndexes.push(i);
          }
          $scope.selectPage(0);
        });

        $scope.selectPage = function selectPage(pageIndex) {
          var startIndex = pageIndex * itemsPerPage;
          var endIndex = startIndex + itemsPerPage;
          $scope.activePage = pageIndex;
          $scope.feedbackItems = allItems.slice(startIndex, endIndex);
        }

        $scope.previousPage = function previousPage() {
          if($scope.previousPageEnabled()) {
            $scope.activePage--;
            $scope.selectPage($scope.activePage);
          }
        }

        $scope.nextPage = function nextPage() {
          if($scope.nextPageEnabled()) {
            $scope.activePage++;
            $scope.selectPage($scope.activePage);
          }
        }

        $scope.nextPageEnabled = function nextPageEnabled() {
          return $scope.activePage < $scope.pageIndexes.length - 1;
        }

        $scope.previousPageEnabled = function previousPageEnabled() {
          return $scope.activePage > 0;
        }

        $scope.nextClasses = function showMoreClasses() {
          return {
            disabled: !$scope.nextPageEnabled()
          };
        }

        $scope.pageClasses = function pageClasses(index) {
          return {
            'is-active': $scope.activePage === index
          };
        }

        $scope.isLoading = function isLoading(feedback) {
          return loadingFeedback.indexOf(feedback) !== -1;
        }
    
        $scope.feedbackChanged = function feedbackChanged(feedback) {
          loadingFeedback.push(feedback);
          updateFeedback(feedback)
          .finally(function updateFeedbackFinally() {
            stopLoading(feedback);
          });
        }

        $scope.toggleCommentEditMode = function toggleCommentEditMode(feedback, index) {
          feedback.commentEditMode = !feedback.commentEditMode;
          feedback.stagedComment = feedback.comment;
          focusCommentInput(index);
        };

        $scope.saveComment = function saveComment(feedback) {
          var newComment = feedback.stagedComment;

          if(feedback.comment === newComment) {
            $scope.toggleCommentEditMode(feedback);

            // no need to hit server if comment is unchanged
            return;
          }

          feedback.inflightUpdate = true;
          feedback.comment = newComment;
          updateFeedback(feedback).then(function() {
            $scope.toggleCommentEditMode(feedback);
            feedback.inflightUpdate = false;
          });
        };
      }
    }
  });
