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

angular.module('resources.portfolio', ['services.state'])

  .factory('PortfolioResource', function ($resource, StateService) {
    var findPortfolioResource = $resource('/api/:currentState/v1/profile/:portfolioRole/:lang/:userPath');
    var findPortfolioBySharedLinkResource = $resource('/api/public/v1/profile/:sharedLinkFragment');
    var createPortfolioResource = $resource('/api/private/v1/profile/:portfolioRole/:lang', {
      portfolioRole: '@portfolioRole',
      lang: '@lang'
    });
    var updatePortfolioResource = $resource('/api/:currentState/v1/profile/:id', { id: '@id' }, { update: { method: 'PUT' } });

    function find(state, portfolioRole, portfolioLang, userPath) {
      return findPortfolioResource
        .get({
          currentState: state,
          portfolioRole: portfolioRole,
          lang: portfolioLang,
          userPath: userPath
        }).$promise;
    }

    function findBySharedLink(sharedLinkFragment) {
      return findPortfolioBySharedLinkResource
        .get({ sharedLinkFragment: sharedLinkFragment })
        .$promise;
    }

    function update(portfolio) {
      return updatePortfolioResource
        .update({ currentState: StateService.getCurrent() }, {
          id: portfolio.id,
          intro: portfolio.intro,
          ownerName: portfolio.ownerName,
          visibility: portfolio.visibility,
          componentOrders: portfolio.componentOrders
        }).$promise;
    }

    function create(role, lang) {
      return createPortfolioResource.save({
        portfolioRole: role,
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
