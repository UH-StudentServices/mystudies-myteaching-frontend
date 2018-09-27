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

angular.module('directives.contactInformation', [
    'services.contactInformation',
    'services.portfolioRole',
    'portfolioAnalytics'])

  .constant('SomeLinkType', {
    FACEBOOK: 'FACEBOOK',
    YOUTUBE: 'YOUTUBE',
    TWITTER: 'TWITTER',
    TUHAT: 'TUHAT',
    RESEARCH_GATE: 'RESEARCH_GATE',
    ACADEMIA: 'ACADEMIA',
    WEBSITE_LINK: 'WEBSITE_LINK'
  })

  .factory('StudentSocialMediaLinks', function(SomeLinkType) {
    return [SomeLinkType.TWITTER, SomeLinkType.FACEBOOK, SomeLinkType.YOUTUBE,
            SomeLinkType.TUHAT, SomeLinkType.RESEARCH_GATE, SomeLinkType.ACADEMIA, SomeLinkType.WEBSITE_LINK];
  })

  .factory('TeacherSocialMediaLinks', function(SomeLinkType) {
    return [SomeLinkType.TWITTER, SomeLinkType.TUHAT, SomeLinkType.RESEARCH_GATE, SomeLinkType.ACADEMIA];
  })

  .directive('contactInformation', function(ContactInformationService,
                                            SomeLinkType,
                                            PortfolioRole,
                                            PortfolioRoleService,
                                            TeacherSocialMediaLinks,
                                            StudentSocialMediaLinks,
                                            AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        contactInformationData: '&',
        ownerName: '@',
        portfolioId: '@',
        portfolioLang: '@'
      },
      templateUrl: 'app/directives/contactInformation/contactInformation.html',
      link: function($scope) {
        $scope.editing = false;
        $scope.contactInfo = $scope.contactInformationData() || {};
        $scope.contactInfo.someLinks = $scope.contactInfo.someLinks || [];

        function addDefaultSomeLinkTypes() {
          var defaultSocialMediaLinks = PortfolioRoleService.isInRole(PortfolioRole.TEACHER) ?
            TeacherSocialMediaLinks : StudentSocialMediaLinks;

          defaultSocialMediaLinks.forEach(function(socialMediaLinkType) {
            if (!_.find($scope.contactInfo.someLinks, {type: socialMediaLinkType})) {
              $scope.contactInfo.someLinks.push({type: socialMediaLinkType});
            }
          });
        }

        function trackIfNeeded() {
          function getFieldsThatHaveValues(object) {
            return _.filter(
              _.concat(
                _.map(object, function(value, key) {
                  return value && value !== Object(value) ? key : null;
                }),
                _.map(object.someLinks, function(value) {
                  return value.url ? value.type : null;
                })
              )
            );
          }

          AnalyticsService.trackEventIfAdded(getFieldsThatHaveValues($scope.origContactInfo),
            getFieldsThatHaveValues($scope.contactInfo),
            AnalyticsService.ec.CONTACT_INFO, AnalyticsService.ea.ADD);
        }

        $scope.edit = function() {
          $scope.editing = true;
          addDefaultSomeLinkTypes();
          $scope.origContactInfo = _.cloneDeep($scope.contactInfo);
        };

        function selectFilledSomeLinks(someLinks) {
          return _.filter(someLinks, function(someLink) {
            return !_.isEmpty(someLink.url);
          });
        }

        $scope.exitEdit = function() {
          var updateContactInformationRequest = _.assign({}, $scope.contactInfo);

          trackIfNeeded();
          updateContactInformationRequest.someLinks =
            selectFilledSomeLinks($scope.contactInfo.someLinks);
          ContactInformationService
            .updateContactInformation($scope.portfolioId, updateContactInformationRequest)
            .then(function(data) {
              $scope.contactInfo = data;
              $scope.editing = false;
            });
          return true;
        };

        $scope.reloadEmployeeContactInformation = function() {
          ContactInformationService
            .getEmployeeContactInformation($scope.portfolioId)
            .then(function(data) {
              _.assign($scope.contactInfo, _.omitBy(data, function(value, key) {
                return key === 'someLinks' || !value;
              }));
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
