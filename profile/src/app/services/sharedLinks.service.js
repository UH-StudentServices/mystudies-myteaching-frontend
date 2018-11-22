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

angular.module('services.sharedLinks', [
  'services.profile',
  'resources.sharedLinks'
])
  .factory('SharedLinksService', function (ProfileService,
    SharedLinksResource,
    dateArrayToMomentObject,
    momentDateToLocalDateTimeArray) {
    function getProfileId() {
      return ProfileService.getProfile().then(function (profile) {
        return profile.id;
      });
    }

    function create(sharedLink) {
      return getProfileId().then(function (profileId) {
        sharedLink.expiryDate = momentDateToLocalDateTimeArray(sharedLink.expiryDate);
        return SharedLinksResource.create(profileId, sharedLink).then(function (newLink) {
          newLink.expiryDate = dateArrayToMomentObject(newLink.expiryDate);
          return newLink;
        });
      });
    }

    function get() {
      return getProfileId().then(function (profileId) {
        return SharedLinksResource.get(profileId).then(function (sharedLinks) {
          return _.map(sharedLinks, function (link) {
            link.expiryDate = dateArrayToMomentObject(link.expiryDate);
            return link;
          });
        });
      });
    }

    function remove(sharedLinkId) {
      return getProfileId().then(function (profileId) {
        return SharedLinksResource.remove(profileId, sharedLinkId);
      });
    }

    return {
      create: create,
      get: get,
      remove: remove
    };
  });
