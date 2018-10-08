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

angular.module('directives.visibility', [
  'services.state',
  'services.session',
  'utils.browser'
])

  .constant('Visibility', {
    MY_TEACHINGS_ONLY:
    function teacherOnly($q, StateService, State) {
      return $q.resolve(StateService.getRootStateName() === State.MY_TEACHINGS);
    },
    MY_STUDIES_ONLY:
    function studentOnly($q, StateService, State) {
      return $q.resolve(StateService.getRootStateName() === State.MY_STUDIES);
    },
    TEACHER_ONLY:
    function teacherOnly($q, StateService, State, SessionService, Role) {
      return SessionService.isInRole(Role.TEACHER);
    },
    STUDENT_ONLY:
    function teacherOnly($q, StateService, State, SessionService, Role) {
      return SessionService.isInRole(Role.STUDENT);
    },
    ADMIN_ONLY:
    function adminOnly($q, StateService, State, SessionService, Role) {
      return SessionService.isInRole(Role.ADMIN);
    },
    DEV_AND_QA_ONLY:
    function devAndQaOnly($q, StateService, State, SessionService, Role, Configuration) {
      var env = Configuration.environment;

      return $q.resolve(
        env === 'local'
          || env === 'dev'
          || env === 'qa'
      );
    },
    MOBILE_ONLY:
    function mobileOnly($q, StateService, State, SessionService, Role, Configuration, BrowserUtil) {
      return $q.resolve(BrowserUtil.isMobile());
    },
    DESKTOP_ONLY:
    function desktopOnly(
      $q,
      StateService,
      State,
      SessionService,
      Role,
      Configuration,
      BrowserUtil
    ) {
      return $q.resolve(!BrowserUtil.isMobile());
    }
  })

/**
* Implemented based on ngIf directive
* https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L3
*/
  .directive('limitVisibility',
    function (
      $q,
      $animate,
      $compile,
      Visibility,
      StateService,
      State,
      SessionService,
      Role,
      Configuration,
      BrowserUtil
    ) {
      return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        scope: { limitVisibility: '=' },
        link: function ($scope, $element, $attr, ctrl, $transclude) {
          var element;
          var childScope;

          function limitArgumentsToFunctions() {
            return _.map($scope.limitVisibility, function (limit) {
              if (Visibility[limit]) {
                return Visibility[limit];
              }
              throw Error('limitVisibility directive: Invalid Visibility argument ' + limit);
            });
          }

          function render(visibilities) {
            if (_.every(visibilities, Boolean)) {
              if (!childScope) {
                $transclude(function (clone, newScope) {
                  element = clone;
                  childScope = newScope;
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            } else {
              if (element) {
                element.remove();
                element = null;
              }
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }
            }
          }

          function evaluateVisibility() {
            $q.all(_.map(limitArgumentsToFunctions(), function (limitFunction) {
              return limitFunction(
                $q,
                StateService,
                State,
                SessionService,
                Role,
                Configuration,
                BrowserUtil
              );
            }))
              .then(render);
          }
          // eslint-disable-next-line no-unused-vars, vars-on-top
          var viewportSizeChangesSubscription =
            BrowserUtil.viewportSizeSubject.subscribe(evaluateVisibility);
        }
      };
    });
