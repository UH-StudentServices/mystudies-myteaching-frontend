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

angular.module('resources.profile', ['services.state'])

  .factory('ProfileResource', function ($resource, StateService) {
    var findProfileResource = $resource('/api/:currentState/v1/profile/:profileRole/:lang/:userPath');
    var findProfileBySharedLinkResource = $resource('/api/public/v1/profile/shared/:sharedLinkFragment');
    var createProfileResource = $resource('/api/private/v1/profile/:profileRole/:lang', {
      profileRole: '@profileRole',
      lang: '@lang'
    });
    var updateProfileResource = $resource('/api/:currentState/v1/profile/:id', { id: '@id' }, { update: { method: 'PUT' } });

    function find(state, profileRole, profileLang, userPath) {
      return findProfileResource
        .get({
          currentState: state,
          profileRole: profileRole,
          lang: profileLang,
          userPath: userPath
        }).$promise;
    }

    function findBySharedLink(sharedLinkFragment) {
      return findProfileBySharedLinkResource
        .get({ sharedLinkFragment: sharedLinkFragment })
        .$promise;
    }

    function update(profile) {
      return updateProfileResource
        .update({ currentState: StateService.getCurrent() }, {
          id: profile.id,
          intro: profile.intro,
          ownerName: profile.ownerName,
          visibility: profile.visibility,
          componentOrders: profile.componentOrders
        }).$promise;
    }

    function create(role, lang) {
      return createProfileResource.save({
        profileRole: role,
        lang: lang
      }).$promise;
    }

    return {
      find: find,
      findBySharedLink: findBySharedLink,
      update: update,
      create: create
    };
  });
