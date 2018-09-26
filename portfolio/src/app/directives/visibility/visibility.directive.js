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
  ['services.state',
   'services.visibility',
   'services.portfolio',
   'services.preview',
   'portfolioAnalytics'])

  .directive('portfolioVisibility', function(AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      templateUrl: 'app/directives/visibility/portfolioVisibility.html',
      controller: function($scope, PortfolioService) {
        PortfolioService.getPortfolio().then(function(portfolio) {
          $scope.portfolio = portfolio;
        });

        $scope.setVisibility = function(visibility) {
          AnalyticsService.trackEvent(AnalyticsService.ec.PORTFOLIO, AnalyticsService.ea.SET_VISIBILITY, visibility);
          PortfolioService.getPortfolio().then(function(portfolio) {
            portfolio.visibility = visibility;
            return PortfolioService.updatePortfolio(portfolio);
          }).then(function(portfolio) {
            $scope.portfolio = portfolio;
          });
        };

      }
    };
  })

  .directive('visibilityToggle', function(VisibilityService, Visibility, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        componentId: '@',
        sectionName: '@',
        instanceName: '@'
      },
      templateUrl: 'app/directives/visibility/visibilityToggle.html',
      link: function(scope) {
        var visibilityDescriptor = _.pick(scope, ['componentId', 'sectionName', 'instanceName']);

        scope.Visibility = Visibility;

        VisibilityService.getComponentVisibility(visibilityDescriptor)
          .then(function(visibility) {
            scope.visibility = visibility;
          });

        scope.toggleVisibility = function() {
          var newVisibility = scope.visibility === Visibility.PUBLIC ? Visibility.PRIVATE : Visibility.PUBLIC;

          AnalyticsService.trackEvent(scope.componentId.toLowerCase(),
            AnalyticsService.ea.SET_VISIBILITY, newVisibility);

          VisibilityService.setComponentVisibility(visibilityDescriptor, newVisibility)
            .then(function(visibility) {
              scope.visibility = visibility;
            });
        };
      }
    };
  })

  .constant('VisibilityRoles', {
    TEACHER: function teacherOnly(PortfolioRoleService, PortfolioRole) {
      return PortfolioRoleService.isInRole(PortfolioRole.TEACHER);
    },
    STUDENT: function studentOnly(PortfolioRoleService, PortfolioRole) {
      return PortfolioRoleService.isInRole(PortfolioRole.STUDENT);
    }
  })

  /**
   * Implemented based on ngIf directive
   * https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L3
   */
  .directive('limitVisibility',
    function($q,
             $animate,
             VisibilityRoles,
             PortfolioRoleService,
             PortfolioRole,
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
        scope: {
        },
        link: function(scope, $element, $attr, ctrl, $transclude) {
          var preview = PreviewService.isPreview(),
              currentState = StateService.getCurrent(),
              limitVisibility = scope.$parent.$eval($attr.limitVisibility) || $attr.limitVisibility;

          function isLimitedByPrivateVisibility(visibility) {
            if (visibility === Visibility.PRIVATE &&
              (preview || currentState !== State.PRIVATE)) {
              return $q.when(true);
            } else {
              return $q.when(false);
            }
          }

          function isLimitedByRole() {
            var roleLimits = _.get(limitVisibility, 'roles');

            if (roleLimits) {
              return $q.when(!_.some(roleLimits, function(role) {
                return VisibilityRoles[role](PortfolioRoleService, PortfolioRole);
              }));
            } else {
              return $q.when(false);
            }
          }

          function isLimitedByPortfolioComponentVisibility() {
            var visibilityDescriptor = _.pick(limitVisibility,
              ['componentId', 'sectionName', 'instanceName']);

            return _.some(visibilityDescriptor) ?
              VisibilityService.getComponentVisibility(visibilityDescriptor)
                .then(isLimitedByPrivateVisibility) :
              $q.when(false);
          }

          $q.all([
            isLimitedByPrivateVisibility(limitVisibility),
            isLimitedByRole(),
            isLimitedByPortfolioComponentVisibility()]).then(function(limits) {
              if (!_.some(limits, Boolean)) {
                $transclude(function(clone) {
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            });
        }
      };
    }
  );
