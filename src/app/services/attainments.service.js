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

angular.module('services.attainments', ['resources.attainments', 'utils.moment'])

  .constant('monthsCount', 6)

  .factory('AttainmentsService', function(AttainmentsResource, dateArrayToUTCMomentObject,
                                          monthsCount) {
    var now = moment(),
        studyAttainmentsPromise;

    function getStudyAttainments() {
      if(!studyAttainmentsPromise) {
        studyAttainmentsPromise = AttainmentsResource.getStudyAttainments().then(function(data) {
          return _.map(data, function(attainment) {
            attainment.attainmentDate = dateArrayToUTCMomentObject(attainment.attainmentDate)
              .local();

            return attainment;
          });
        });
      }
      return studyAttainmentsPromise;
    }

    function getLastStudyAttainments() {
      return getStudyAttainments().then(function(attainments) {
        return _.filter(attainments, function(attainment) {
          var diff = now.diff(attainment.attainmentDate, 'months');

          return diff >= 0 && diff < monthsCount;
        });
      });
    };

    function hasStudyAttainments() {
      return getStudyAttainments().then(function(attainments) {
        return attainments && attainments.length > 0;
      });
    }

    return {
      getLastStudyAttainments: getLastStudyAttainments,
      hasStudyAttainments: hasStudyAttainments
    };

  });
