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

angular.module('services.samples', [
  'services.portfolio',
  'resources.samples'])

  .factory('SamplesService', function(PortfolioService,
                                      SamplesResource) {

    var Rx = window.Rx,
        sampleSubject;

    function publishSamples(samples) {
      sampleSubject.onNext(samples);
      return samples;
    }

    function getPortfolioId(portfolio) {
      return portfolio.id;
    }

    function getProperty(propName) {
      return _.partialRight(_.get, propName);
    }

    function getSamples() {
      return PortfolioService.getPortfolio()
        .then(getProperty('samples'));
    }

    function getSampleSubject() {
      if (!sampleSubject) {
        sampleSubject = new Rx.BehaviorSubject();
        getSamples()
          .then(publishSamples);
      }
      return sampleSubject;
    }

    function updateSamples(portfolioId, updateSamples) {
      return SamplesResource.updateSamples(portfolioId, updateSamples);
    }

    return {
      getSampleSubject: getSampleSubject,
      updateSamples: updateSamples
    };
  });

