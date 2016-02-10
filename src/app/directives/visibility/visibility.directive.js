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
  'services.session'])

.constant('Visibility', {
  TEACHER_ONLY:
    function teacherOnly($q, StateService, State, SessionService, Role, Configuration) {
      return $q.resolve(StateService.getRootStateName() === State.MY_TEACHINGS);
    },
  STUDENT_ONLY:
    function studentOnly($q, StateService, State, SessionService, Role, Configuration) {
      return $q.resolve(StateService.getRootStateName() === State.MY_STUDIES);
    },
  ADMIN_ONLY:
    function adminOnly($q, StateService, State, SessionService, Role, Configuration) {
      return SessionService.isInRole(Role.ADMIN);
    },
  DEV_AND_QA_ONLY:
    function devAndQaOnly($q, StateService, State, SessionService, Role, Configuration) {
      return $q.resolve(Configuration.environment !== 'prod');
    }
})

/**
* Implemented based on ngIf directive
* https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js#L3
*/
.directive('limitVisibility',
  function($q, $animate, Visibility, StateService, State, SessionService, Role, Configuration) {

    return {
      multiElement: true,
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      scope: {
        limitVisibility: '='
      },
      link: function($scope, $element, $attr, ctrl, $transclude) {
        $q.all(
          _.map(
            _.map($scope.limitVisibility, function(limit) {
              if(Visibility[limit]) {
                return Visibility[limit];
              }
              throw 'limitVisibility directive: Invalid Visibility argument';
            }),
            function(limitFunction) {
              return limitFunction($q, StateService, State, SessionService, Role, Configuration);
            }
          )
        ).then(function visibilitiesResolved(visibilities) {
          if(_.every(visibilities, Boolean)) {
            $transclude(function(clone) {
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });
      }
    };
  }
);