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

angular.module('directives.contactInformation', ['services.contactInformation'])

  .constant('SomeLinkType', {
    FACEBOOK: 'FACEBOOK',
    YOUTUBE: 'YOUTUBE',
    TWITTER: 'TWITTER'
  })
  .directive('contactInformation', function(ContactInformationService, SomeLinkType) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        contactInformationData: '&',
        portfolioId: '@'
      },
      templateUrl: 'app/directives/contactInformation/contactInformation.html',
      link: function($scope) {
        $scope.editing = false;
        $scope.contactInformation = $scope.contactInformationData() || {};
        $scope.contactInformation.someLinks = $scope.contactInformation.someLinks || [];

        function addDefaultSomeLinkTypes() {
          if (!_.find($scope.contactInformation.someLinks, {type: SomeLinkType.FACEBOOK})) {
            $scope.contactInformation.someLinks.push({type: SomeLinkType.FACEBOOK});
          }
          if (!_.find($scope.contactInformation.someLinks, {type: SomeLinkType.YOUTUBE})) {
            $scope.contactInformation.someLinks.push({type: SomeLinkType.YOUTUBE});
          }
          if (!_.find($scope.contactInformation.someLinks, {type: SomeLinkType.TWITTER})) {
            $scope.contactInformation.someLinks.push({type: SomeLinkType.TWITTER});
          }
        }

        $scope.edit = function() {
          $scope.editing = true;
          addDefaultSomeLinkTypes();
        };

        function selectFilledSomeLinks(someLinks) {
          return _.filter($scope.contactInformation.someLinks, function(someLink) {
            return !_.isEmpty(someLink.url);
          });
        }

        $scope.exitEdit = function() {
          var updateContactInformationRequest = {};

          updateContactInformationRequest.phoneNumber = $scope.contactInformation.phoneNumber;
          updateContactInformationRequest.email = $scope.contactInformation.email;
          updateContactInformationRequest.someLinks =
            selectFilledSomeLinks($scope.contactInformation.someLinks);
          ContactInformationService
            .updateContactInformation($scope.portfolioId, updateContactInformationRequest)
            .then(function(data) {
              $scope.contactInformation = data;
              $scope.editing = false;
            });
        };

        $scope.editSomeLink = function(someLink) {
          someLink.edit = true;
        };

        $scope.exitSomeLinkEdit = function(someLink) {
          someLink.edit = false;
        };
      }
    };
  });
