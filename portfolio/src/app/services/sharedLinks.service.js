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
  'services.portfolio',
  'resources.sharedLinks'
])
  .factory('SharedLinksService', function (PortfolioService, SharedLinksResource) {
    function getPortfolioId() {
      return PortfolioService.getPortfolio().then(function (portfolio) {
        return portfolio.id;
      });
    }

    function create(shareLink) {
      return SharedLinksResource.create(getPortfolioId(), shareLink);
    }

    function save(shareLinkChange) {
      return SharedLinksResource.save(getPortfolioId(), shareLinkChange);
    }

    function get() {
      return SharedLinksResource.get(getPortfolioId());
    }

    return {
      create: create,
      save: save,
      get: get
    };
  });
