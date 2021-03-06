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

angular.module('directives.contactInformation', [
  'services.contactInformation',
  'services.profileRole',
  'profileAnalytics'
])

  .constant('SomeLinkType', {
    FACEBOOK: { type: 'FACEBOOK', baseUrl: 'https://facebook.com/' },
    YOUTUBE: { type: 'YOUTUBE', baseUrl: 'https://youtube.com/' },
    TWITTER: { type: 'TWITTER', baseUrl: 'https://twitter.com/' },
    TUHAT: { type: 'TUHAT', baseUrl: 'https://tuhat.helsinki.fi/portal/fi/persons/' },
    RESEARCH_GATE: { type: 'RESEARCH_GATE', baseUrl: 'https://www.researchgate.net/' },
    ACADEMIA: { type: 'ACADEMIA', baseUrl: 'https://xxx.academia.edu/' },
    WEBSITE_LINK: { type: 'WEBSITE_LINK', baseUrl: 'https://' },
    LINKEDIN: { type: 'LINKEDIN', baseUrl: 'https://www.linkedin.com/' }
  })

  .factory('StudentSocialMediaLinks', function (SomeLinkType) {
    return [
      SomeLinkType.TWITTER,
      SomeLinkType.FACEBOOK,
      SomeLinkType.YOUTUBE,
      SomeLinkType.LINKEDIN,
      SomeLinkType.TUHAT,
      SomeLinkType.RESEARCH_GATE,
      SomeLinkType.ACADEMIA,
      SomeLinkType.WEBSITE_LINK
    ];
  })

  .factory('TeacherSocialMediaLinks', function (SomeLinkType) {
    return [
      SomeLinkType.TWITTER,
      SomeLinkType.TUHAT,
      SomeLinkType.RESEARCH_GATE,
      SomeLinkType.ACADEMIA,
      SomeLinkType.LINKEDIN
    ];
  })

  .directive('contactInformation', function (ContactInformationService,
    SomeLinkType,
    ProfileRole,
    ProfileRoleService,
    TeacherSocialMediaLinks,
    StudentSocialMediaLinks,
    AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        contactInformationData: '&',
        ownerName: '@',
        profileId: '@',
        profileLang: '@'
      },
      templateUrl: 'app/directives/contactInformation/contactInformation.html',
      link: function ($scope) {
        $scope.editing = false;
        $scope.contactInfo = $scope.contactInformationData() || {};
        $scope.contactInfo.someLinks = $scope.contactInfo.someLinks || [];

        function addDefaultSomeLinkTypes() {
          var defaultSocialMediaLinks = ProfileRoleService.isInRole(ProfileRole.TEACHER)
            ? TeacherSocialMediaLinks : StudentSocialMediaLinks;

          defaultSocialMediaLinks.forEach(function (socialMediaLinkType) {
            if (!_.find($scope.contactInfo.someLinks, { type: socialMediaLinkType.type })) {
              $scope.contactInfo.someLinks.push(socialMediaLinkType);
            }
          });
        }

        function trackIfNeeded() {
          function getFieldsThatHaveValues(object) {
            return _.filter(
              _.concat(
                _.map(object, function (value, key) {
                  return value && value !== Object(value) ? key : null;
                }),
                _.map(object.someLinks, function (value) {
                  return value.url ? value.type : null;
                })
              )
            );
          }

          AnalyticsService.trackEventIfAdded(getFieldsThatHaveValues($scope.origContactInfo),
            getFieldsThatHaveValues($scope.contactInfo),
            AnalyticsService.ec.CONTACT_INFO, AnalyticsService.ea.ADD);
        }

        $scope.edit = function () {
          $scope.editing = true;
          addDefaultSomeLinkTypes();
          $scope.origContactInfo = _.cloneDeep($scope.contactInfo);
        };

        function selectFilledSomeLinks(someLinks) {
          return _.filter(someLinks, 'url');
        }

        $scope.exitEdit = function () {
          var updateContactInformationRequest;
          if ($scope.editContactInformation.$invalid) {
            return false;
          }
          updateContactInformationRequest = _.assign({}, $scope.contactInfo);

          updateContactInformationRequest.someLinks =
            selectFilledSomeLinks($scope.contactInfo.someLinks);
          ContactInformationService
            .updateContactInformation($scope.profileId, updateContactInformationRequest)
            .then(function (data) {
              trackIfNeeded();
              $scope.contactInfo = data;
              $scope.editing = false;
            })
            .catch(function () {
              return false;
            });
          return true;
        };

        $scope.reloadEmployeeContactInformation = function () {
          ContactInformationService
            .getEmployeeContactInformation($scope.profileId)
            .then(function (data) {
              _.assign($scope.contactInfo, _.omitBy(data, function (value, key) {
                return key === 'someLinks' || !value;
              }));
            });
        };

        $scope.cancelEdit = function () {
          $scope.editing = false;
          $scope.contactInfo = $scope.origContactInfo;
          $scope.contactInfo.someLinks = selectFilledSomeLinks($scope.origContactInfo.someLinks);
        };
      }
    };
  });
