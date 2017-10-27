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

angular.module('directives.helpIcon', ['directives.popover'])

  .directive('helpIcon', function(BrowserUtil) {

    return {
      restrict: 'E',
      replace: true,
      scope: {
        translationKey: '@',
        ariaLabelTranslationKey: '@',
        plainTitle: '=',
        uniqueId: '@',
        panelAlign: '@'
      },
      templateUrl: 'app/directives/helpIcon/helpIcon.html',
      link: function(scope) {
        var alignmentClass;

        if (BrowserUtil.isMobile() || scope.panelAlign === 'center') {
          alignmentClass = 'help-icon-popover-container--center-aligned';
        } else if (scope.panelAlign === 'right') {
          alignmentClass = 'help-icon-popover-container--right-aligned';
        } else {
          alignmentClass = 'help-icon-popover-container--left-aligned';
        }

        _.assign(scope, {
          uniqueId: scope.$id,
          alignmentClass: alignmentClass
        });
      }
    };
  });
