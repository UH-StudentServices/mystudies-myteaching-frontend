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

angular.module('directives.pageFooter', ['constants.commonExternalLinks', 'constants.externalLinks', 'services.state'])
  .directive('pageFooter', function (pageFooterLinks, footerLinks) {
    return {
      restrict: 'E',
      templateUrl: 'app/directives/pageFooter/page_footer.html',
      link: function ($scope) {
        $scope.pageFooterLinks = _.concat(pageFooterLinks, footerLinks);
        $scope.currentYear = moment().year();
      }
    };
  });
