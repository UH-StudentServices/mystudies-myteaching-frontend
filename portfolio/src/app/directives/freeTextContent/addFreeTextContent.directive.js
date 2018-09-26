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

angular.module('directives.addFreeText', ['services.freeTextContent', 'portfolioAnalytics'])

.directive('addFreeTextContent', function(FreeTextContentService, FreeTextContentFactory, AnalyticsService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: 'app/directives/freeTextContent/addFreeTextContent.html',
    link: function(scope) {
      scope.insertFreeTextContent = function() {
        var entry = FreeTextContentFactory.defaultFreeTextContent({});

        AnalyticsService.trackEvent(AnalyticsService.ec.FREE_TEXT_CONTENT, AnalyticsService.ea.ADD);

        FreeTextContentService
          .insertFreeTextContent(entry, {});
      };
    }
  };
});
