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

angular.module('services.keyword', ['services.portfolio', 'resources.keyword'])
  .factory('KeywordService', function(PortfolioService, KeywordResource) {
    var Rx = window.Rx;
    var keywordsSubject = new Rx.BehaviorSubject();

    function publishKeywords(keywords) {
      keywordsSubject.onNext(keywords);
      return keywords;
    }

    function getPortfolioId(portfolio) {
      return portfolio.id;
    }

    function updateKeywords(portfolioId, updateKeywordsRequest) {
      return KeywordResource.updateKeywords(portfolioId, updateKeywordsRequest)
        .then(publishKeywords);
    }

    function getKeywordsSubject() {
      PortfolioService.getPortfolio()
        .then(_.partialRight(_.get, 'keywords'))
        .then(publishKeywords);

      return keywordsSubject;
    }

    return {
      updateKeywords: updateKeywords,
      getKeywordsSubject: getKeywordsSubject
    };
  });
