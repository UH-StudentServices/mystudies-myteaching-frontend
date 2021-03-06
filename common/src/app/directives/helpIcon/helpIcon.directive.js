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

angular.module('directives.helpIcon', ['directives.popover'])

  .directive('helpIcon', function (BrowserUtil) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        translationKey: '@',
        ariaLabelTranslationKey: '@?',
        plainTitle: '=',
        uniqueId: '@',
        panelAlign: '@',
        mobileAlign: '@',
        panelPosition: '@'
      },
      templateUrl: 'app/directives/helpIcon/helpIcon.html',
      link: function (scope) {
        var alignmentClass;
        var positionClass = '';
        var align = BrowserUtil.isMobile ? scope.mobileAlign : scope.panelAlign;

        if ((BrowserUtil.isMobile() && !scope.mobileAlign) || align === 'center') {
          alignmentClass = 'help-icon-popover-container--center-aligned';
        } else if (align === 'right') {
          alignmentClass = 'help-icon-popover-container--right-aligned';
        } else {
          alignmentClass = 'help-icon-popover-container--left-aligned';
        }

        if (scope.panelPosition === 'top' && !BrowserUtil.isMobile()) {
          positionClass = 'help-icon-popover-container--top-positioned';
        }

        _.assign(scope, {
          uniqueId: scope.$id,
          alignmentClass: alignmentClass,
          positionClass: positionClass,
          ariaLabelTranslationKey: scope.ariaLabelTranslationKey || 'general.help'
        });
      }
    };
  });
