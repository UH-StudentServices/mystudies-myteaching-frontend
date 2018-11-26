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

angular.module('directives.visibility',
  [
    'services.state',
    'services.visibility',
    'services.profile',
    'services.preview',
    'profileAnalytics'
  ])

  .directive('profileVisibility', function (AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/visibility/profileVisibility.html',
      controller: function ($scope, ProfileService) {
        ProfileService.getProfile().then(function (profile) {
          $scope.profile = profile;
        });

        $scope.setVisibility = function (visibility) {
          AnalyticsService.trackEvent(
            AnalyticsService.ec.PROFILE,
            AnalyticsService.ea.SET_VISIBILITY,
            visibility
          );

          ProfileService.getProfile().then(function (profile) {
            profile.visibility = visibility;
            return ProfileService.updateProfile(profile);
          }).then(function (profile) {
            $scope.profile = profile;
          });
        };
      }
    };
  })

  .directive('visibilityToggle', function (VisibilityService, Visibility, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '@',
        sectionName: '@',
        instanceName: '@'
      },
      templateUrl: 'app/directives/visibility/visibilityToggle.html',
      link: function (scope) {
        var visibilityDescriptor = _.pick(scope, ['componentId', 'sectionName', 'instanceName']);

        scope.Visibility = Visibility;

        VisibilityService.getComponentVisibility(visibilityDescriptor)
          .then(function (visibility) {
            scope.visibility = visibility;
          });

        scope.toggleVisibility = function () {
          var newVisibility = scope.visibility === Visibility.PUBLIC
            ? Visibility.PRIVATE
            : Visibility.PUBLIC;

          AnalyticsService.trackEvent(scope.componentId.toLowerCase(),
            AnalyticsService.ea.SET_VISIBILITY, newVisibility);

          VisibilityService.setComponentVisibility(visibilityDescriptor, newVisibility)
            .then(function (visibility) {
              scope.visibility = visibility;
            });
        };
      }
    };
  })

  .directive('itemVisibilityToggle', function (Visibility) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        item: '=',
        callback: '='
      },
      templateUrl: 'app/directives/visibility/itemVisibilityToggle.html',
      link: function (scope) {
        scope.Visibility = Visibility;
        scope.visibility = scope.item.visibility;

        scope.toggleVisibility = function () {
          scope.item.visibility = scope.item.visibility === Visibility.PUBLIC
            ? Visibility.PRIVATE
            : Visibility.PUBLIC;
          scope.visibility = scope.item.visibility;

          if (typeof (scope.callback) === 'function') {
            scope.callback(scope.item);
          }
        };
      }
    };
  })

  .constant('VisibilityRoles', {
    TEACHER: function teacherOnly(ProfileRoleService, ProfileRole) {
      return ProfileRoleService.isInRole(ProfileRole.TEACHER);
    },
    STUDENT: function studentOnly(ProfileRoleService, ProfileRole) {
      return ProfileRoleService.isInRole(ProfileRole.STUDENT);
    }
  })

  /**
   * Implemented based on ngIf directive
   * https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L3
   */
  .directive('limitVisibility',
    function ($q,
      $animate,
      VisibilityRoles,
      ProfileRoleService,
      ProfileRole,
      VisibilityService,
      Visibility,
      StateService,
      State,
      PreviewService) {
      return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        scope: {},
        link: function (scope, $element, $attr, ctrl, $transclude) {
          var preview = PreviewService.isPreview();
          var currentState = StateService.getCurrent();
          var limitVisibility = scope.$parent.$eval($attr.limitVisibility) || $attr.limitVisibility;

          function isLimitedByPrivateVisibility(visibility) {
            if (visibility === Visibility.PRIVATE
              && (preview || currentState !== State.PRIVATE)) {
              return $q.when(true);
            }
            return $q.when(false);
          }

          function isLimitedByRole() {
            var roleLimits = _.get(limitVisibility, 'roles');

            if (roleLimits) {
              return $q.when(!_.some(roleLimits, function (role) {
                return VisibilityRoles[role](ProfileRoleService, ProfileRole);
              }));
            }
            return $q.when(false);
          }

          function isLimitedByProfileComponentVisibility() {
            var visibilityDescriptor = _.pick(limitVisibility,
              ['componentId', 'sectionName', 'instanceName']);

            return _.some(visibilityDescriptor)
              ? VisibilityService.getComponentVisibility(visibilityDescriptor)
                .then(isLimitedByPrivateVisibility)
              : $q.when(false);
          }

          $q.all([
            isLimitedByPrivateVisibility(limitVisibility),
            isLimitedByRole(),
            isLimitedByProfileComponentVisibility()
          ]).then(function (limits) {
            if (!_.some(limits, Boolean)) {
              $transclude(function (clone) {
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          });
        }
      };
    })
  .directive('limitItemVisibility',
    function ($animate,
      Visibility,
      PreviewService) {
      return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        scope: { limitItemVisibility: '=' },
        link: function (scope, $element, $attr, ctrl, $transclude) {
          var isPreview = PreviewService.isPreview();
          var item = scope.limitItemVisibility;

          function isLimitedByPreview() {
            return isPreview ? item.visibility === Visibility.PRIVATE : false;
          }

          if (!isLimitedByPreview()) {
            $transclude(function (clone) {
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        }
      };
    });
