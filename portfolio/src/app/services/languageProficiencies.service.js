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

angular.module('services.languageProficiencies', [
  'services.portfolio',
  'resources.languageProficiencies'])

  .constant('AvailablePortfolioLanguages', ['af', 'ar', 'zh', 'cs', 'da', 'nl', 'en',
    'et', 'fi', 'fr', 'de', 'el', 'hi', 'hu', 'is', 'it', 'ja', 'ko', 'la', 'lv', 'lt',
    'no', 'pl', 'pt', 'ru', 'se', 'sk', 'sl', 'es', 'sv', 'tr'])
  .constant('AvailableLanguageProficiencies', [1, 2, 3, 4, 5])

  .factory('LanguageProficienciesService', function(PortfolioService,
                                                    LanguageProficienciesResource) {
    function getPortfolioId() {
      return PortfolioService.getPortfolio()
        .then(function(portfolio) {
          return portfolio.id;
        });
    }

    function save(updateBatch) {
      return getPortfolioId().then(function(portfolioId) {
        return LanguageProficienciesResource.save(portfolioId, updateBatch);
      });
    }

    return {
      save: save
    };
  });
