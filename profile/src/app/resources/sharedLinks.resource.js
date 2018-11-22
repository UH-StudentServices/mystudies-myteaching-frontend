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

angular.module('resources.sharedLinks', [])

  .constant('SharedLinksResourcePath', '/api/private/v1/profile/:profileId/sharedlinks')

  .factory('SharedLinksResource', function ($resource, SharedLinksResourcePath) {
    function SharedLinksResource(profileId, sharedLinkId) {
      var resourcePath = SharedLinksResourcePath;
      return $resource(resourcePath, { profileId: profileId, sharedLinkId: sharedLinkId }, {
        create: { method: 'POST', isArray: false },
        get: { method: 'GET', isArray: true },
        remove: { url: resourcePath + '/:sharedLinkId', method: 'DELETE', isArray: false }
      });
    }

    function create(profileId, shareLink) {
      return SharedLinksResource(profileId).create(shareLink).$promise;
    }

    function get(profileId) {
      return SharedLinksResource(profileId).get().$promise;
    }

    function remove(profileId, sharedLinkId) {
      return SharedLinksResource(profileId, sharedLinkId).remove().$promise;
    }

    return {
      create: create,
      get: get,
      remove: remove
    };
  });
